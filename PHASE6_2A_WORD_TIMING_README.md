# VocaMini Phase 6.2A — Word timestamps (not phoneme alignment)

This milestone adds **real word-level timestamps emitted by the existing Vosk recognizer**, available in the `/api/pronunciation/recognize` JSON response as `word_timing`. It does **not** invent per-phoneme boundaries. The displayed markers are estimates from speech recognition and are not a pronunciation grade.

## Scope

- `KaldiRecognizer.SetWords(True)` asks Vosk to emit `result` word-level `start`/`end` timestamps.
- `word_timing`: `{source, word_level_only, duration_s, intervals, expected_span}`. When no timestamp exists, `intervals` is empty and `expected_span` is null.
- UI appears only after recognizing a recording, and clears when the word/accent or recording changes, as does the older diagnostic panel.
- No extra Python dependencies or cloud calls. `sw.js` cache version v9.
- Do not publish any real user WAV files or models to Git.

## Test commands

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -p "test_*.py" -v
node --test .\tests\minimal-pairs.test.cjs .\tests\minimal-pairs-ui.test.cjs
node --check .\pronunciation\recorder.js
node --check .\sw.js
```

## Next milestone — genuine phoneme alignment

Add a **real phoneme forced aligner** (e.g. MFA) in a separate environment. This needs an acoustic model, a pronunciation dictionary, valid target transcripts and independent evaluation. MFA's `mfa align` can produce a TextGrid with phone boundaries, but we have **not installed or run MFA**, and **no current VocaMini API assigns phone-level timestamps**. Do not replace word intervals with evenly spaced phonemes or call Vosk phoneme alignment.

Windows MFA setup reference: https://montreal-forced-aligner.readthedocs.io/en/stable/installation.html
