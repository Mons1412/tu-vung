# VocaMini Phase 6.2B — MFA phoneme forced-alignment pilot (US only)

**Status:** Code + automated contract tests ready. **Not yet verified with an installed MFA acoustic model on Windows.** This pilot performs actual forced alignment only when Montreal Forced Aligner (MFA) is installed and the user clicks the dedicated button. Otherwise the UI shows a setup error instead of faking phoneme timings.

## What Phase 6.2B does (and does NOT do)

- Leaves existing Vosk recognition, word timestamps, A/B, Minimal Pairs, and audio diagnostics untouched.
- Adds a **separate, opt-in MFA alignment** button within the pronunciation panel. Button only enables for a `matched: true` Vosk recognition of a **single US word**; no UK models are installed.
- Uses actual `mfa align_one --output_format json` to obtain an MFA **phones** tier (`ARPABET`). This is a time alignment **conditioned on the expected text**; it can align wrongly spoken audio to the intended phonemes. It is **not** error detection, accent verification, or pronunciation scoring.
- Requires mono PCM WAV 16-bit/16 kHz; maximum 16 seconds / 1 MiB; expected single English word only.
- API: `POST /api/pronunciation/align`, `Content-Type: audio/wav`, `X-Expected-Word: water`, `X-Practice-Accent: en-US`. It returns JSON `source: montreal_forced_aligner`, `phoneme_level_only: true`, `pronunciation_score: null`, ARPAbet `intervals` or an explanatory 400/422/503. **Cannot claim a successful MFA run until tested on the user's machine.**

## Install MFA separately from the existing Python `.venv`

MFA official docs recommend Conda/Miniforge, not `pip install` into the Vosk environment:

https://montreal-forced-aligner.readthedocs.io/en/stable/installation.html
https://montreal-forced-aligner.readthedocs.io/en/stable/user_guide/workflows/alignment.html
https://montreal-forced-aligner.readthedocs.io/en/stable/first_steps/

Open **Miniforge Prompt** or a PowerShell where `conda` is configured:

```powershell
conda create -n vocamini-aligner -c conda-forge montreal-forced-aligner -y
conda run -n vocamini-aligner mfa --help
conda run -n vocamini-aligner mfa model download acoustic english_us_arpa
conda run -n vocamini-aligner mfa model download dictionary english_us_arpa
```

Run a sanity check:

```powershell
conda run -n vocamini-aligner mfa model inspect acoustic english_us_arpa
conda run -n vocamini-aligner mfa model inspect dictionary english_us_arpa
```

If `conda` is not on PATH for the Python server, in the same PowerShell that starts the VocaMini server, specify an executable path (adjust for your Miniforge installation):

```powershell
$env:VOCAMINI_MFA_EXE = 'C:\YOUR_MINIFORGE\envs\vocamini-aligner\Scripts\mfa.exe'
.\.venv\Scripts\python.exe .\pronunciation\offline_server.py
```

`VOCAMINI_MFA_EXE` must point to an existing `.exe`; do not use an unverified/example path. Alternatively, make `conda` visible on PATH and the backend will run `conda run -n vocamini-aligner mfa ...`.

## Browser manual test

1. Restart the local Python server and bypass the service worker cache if the new MFA panel is missing.
2. Choose **en-US**, look up `water`, record the word clearly; click **Kiểm tra máy nghe được gì** and confirm Vosk recognizes `water`.
3. Click **Căn chỉnh âm vị bằng MFA**. Real MFA may require model initialization; the UI will show `Chưa căn chỉnh được: ...` if it fails. This is expected when MFA is missing.
4. Only if MFA succeeds, confirm an ARPAbet sequence such as `W`, `AO1`, `T`, `ER0` with timestamps (the actual sequence/timings come **only from MFA**, are not guaranteed, and are not judged for correctness).
5. Changing words, switching US/UK, recording again, or deleting clears the old MFA result.
6. UK mode should not let the user trigger the US alignment model.

For API debugging, use F12 → Network → `/api/pronunciation/align` → Response. Do **not** upload personal voice recordings or MFA cache to GitHub.

## Privacy and resource considerations

- The audio is posted only to the user's `127.0.0.1` Python server when the user explicitly requests alignment.
- A temporary WAV and transcript are created for MFA and removed by `TemporaryDirectory` whether the subprocess succeeds or fails. MFA itself **may maintain its own model cache and diagnostic logs**; inspect configuration before using sensitive recordings. This prototype should not be considered a privacy-audited production application.
- The subprocess has an explicit timeout, and the endpoint has size, WAV format, transcript, and accent checks.
- Downloading MFA and acoustic models initially needs Internet; **alignment itself is local** after models are available.

## Tests and Git

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -p 'test_*.py' -v
node --test .\tests\minimal-pairs.test.cjs .\tests\minimal-pairs-ui.test.cjs .\tests\mfa-ui.test.cjs
node --check .\pronunciation\recorder.js
node --check .\\sw.js
git diff --check
```

After actual MFA verification, commit only code and documentation. Never add `.venv/`, `models/`, model archives, `.env`, `Tool/` or recordings by `git add .`.
