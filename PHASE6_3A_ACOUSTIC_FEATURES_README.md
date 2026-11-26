# VocaMini Phase 6.3A — Acoustic features per MFA interval

**Status: Code + automated tests ready; real Windows microphone verification pending.**

## What is new

After the user explicitly clicks **Căn chỉnh âm vị bằng MFA** for an en-US word, the existing `/api/pronunciation/align` response now includes `acoustic_features`, measured directly from the **same** 16-kHz mono PCM16 WAV and the **actual** phoneme intervals returned by MFA. MFA is **not run twice**, and there is no additional upload, server endpoint, or Python package dependency.

Each interval includes:

| Field | Meaning |
| --- | --- |
| `phone` | MFA's ARPAbet phoneme label (not IPA). |
| `start_s`, `end_s` | Real MFA-provided estimated boundaries; no guessed spans. |
| `duration_ms` | Duration between those boundaries (not good/bad timing). |
| `rms_dbfs` | Mean signal energy in dBFS (affected by microphone level). |
| `peak_dbfs` | Peak signal level in dBFS. |
| `zero_crossings_per_s` | Approximate count of waveform sign changes per second; **noise-sensitive** and **not pitch**. |
| `clipped_pct` | Percentage of PCM samples near the 16-bit clipping limit. |

The entire feature block is labeled `source: "pcm16_mfa_interval_features"`, `feature_only: true`, and `pronunciation_score: null`. **No feature indicates whether any phoneme was pronounced correctly.** The feature UI appears only when the backend responds with validated fields whose phone labels and times correspond to the preceding MFA intervals. For an older server or invalid acoustic data, the MFA timing UI still works but the feature section stays hidden.

## Relevance and limitations

Forced alignment assumes the expected word was spoken. A model may force expected labels onto incorrectly spoken speech, so the measured features may correspond to *incorrectly localized segments*. RMS, zero-crossing rate, and peak cannot identify a phoneme reliably without models, ground-truth labeled data, and controlled microphone conditions. No good/bad thresholds or synthetic pronunciation scores are presented.

As stated in the MFA model documentation: https://huggingface.co/MontrealCorpusTools/english_mfa , the aligner is **not** intended for assessing pronunciation quality. Phase 6.3B requires separately validated assessment and an evaluation dataset.

## Apply on Windows 11

Prerequisite: Phase 6.2B already applied and tested; working directory `E:\01_Projects\Tu vung`.

```powershell
Set-Location -LiteralPath 'E:\01_Projects\Tu vung'
$patch = 'E:\05_Downloads\vocamini-phase6-3a-acoustic-features.patch'
Test-Path $patch
git apply --check $patch
# Only after the check passes:
git apply $patch

.\.venv\Scripts\python.exe -m unittest discover -s tests -p 'test_*.py' -v
node --test .\tests\*.test.cjs
node --check .\pronunciation\recorder.js
node --check .\sw.js
git diff --check
```

Restart the Python server (in the PowerShell with activated MFA Conda environment if that is required for the `mfa.exe` DLLs), selecting the US accent and `water`, then **record → Vosk check → MFA align**. Expect the old phone timeline plus a new section with four rows of signal measurements for phones such as `W`, `AA1`, `T`, and `ER0`. Real values come exclusively from the microphone audio; they will differ per recording.

Confirm that re-record, changing word/accent and deleting remove the previous feature section; UK and ASR-only workflows remain unchanged. If it does not appear, inspect `/api/pronunciation/align` → Response → `acoustic_features`; a stale Python process can still answer with the old schema.

## Privacy and Git

No extra network request is sent. The same temporary WAV is used for alignment and feature extraction; this code does not retain audio or save metrics to disk. However MFA may separately create its own caches/logs; the overall app has **not** undergone a complete privacy audit. Do not push user recordings, MFA caches, `.venv`, `models`, `.env`, `Tool/`, or Conda environments.

Review file `PHASE6_REVIEW_NOTES.md` before the final UI/IPA review.
