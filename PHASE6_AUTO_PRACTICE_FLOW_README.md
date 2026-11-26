# VocaMini — Auto-record + Auto-Vosk practice flow (Ubuntu)

Goal: one click on **🎙️ Luyện phát âm từ này** requests the microphone immediately. The browser displays the recording state while the permission prompt is open. Once the user stops (or the 15-second timer expires), a valid recording is converted to 16-kHz PCM WAV and sent automatically to local Vosk through `/api/pronunciation/recognize`. The manual button is now an optional **Nhận diện lại** retry.

Minimal Pairs are removed from the practice panel and their two `<script>` tags and offline precache; the source modules `pronunciation/minimal-pairs.js` and `pronunciation/phoneme-data.js` are **retained** for a future separate practice area. The A/B self-check checkboxes and the reset code are removed. Listening A/B and explicitly requesting MFA remain available.

No new backend file persistence is introduced: audio remains a temporary Blob in browser memory; the backend processes uploaded WAV locally. The existing MFA path can use temporary files, cleaned in its normal completion/failure handling. A word/accent change or closing the practice panel cancels pending fetches and revokes the browser Blob URL. Server-side in-flight requests cannot be guaranteed to stop just because a browser fetch is aborted; normal per-request server cleanup still applies.

Privacy: Vosk auto-transmission is a behavior change, so the notice text says it is sent automatically to the **local server**; it is not uploaded to a cloud assessment service. Remote reference-audio sources are not changed.

## Ubuntu verification

```bash
cd ~/Projects/tu-vung
node --check pronunciation/recorder.js
node --check sw.js
node --test tests/*.test.cjs
./.venv/bin/python -m unittest discover -s tests -p 'test_*.py' -v
```

Restart the local backend, hard-refresh the page, choose a target such as `water`, press practice (the mic should begin with no second click), press stop and confirm `/api/pronunciation/recognize` is invoked once automatically. Check 15-second auto-stop, permission denial and retry, switching word during a pending request, closing mid-recording, US/UK recognition, manual MFA still opt-in, and no Minimal Pairs/self-check visible.

`/api/pronunciation/recognize` is ASR; it does not grade phoneme correctness. Phase 6.3B is still pending.
