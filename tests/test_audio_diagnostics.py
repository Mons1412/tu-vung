"""Recording quality tests, using only the Python standard library."""
import io
import math
import pathlib
import struct
import sys
import unittest
import wave

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'pronunciation'))
from audio_diagnostics import analyze_wav


def wav_of(samples, rate=16000):
    out = io.BytesIO()
    with wave.open(out, 'wb') as fp:
        fp.setnchannels(1)
        fp.setsampwidth(2)
        fp.setframerate(rate)
        fp.writeframes(struct.pack('<' + 'h' * len(samples), *samples))
    return out.getvalue()


class AudioDiagnosticsTest(unittest.TestCase):
    def test_silence_is_not_called_good_pronunciation(self):
        result = analyze_wav(wav_of([0] * 16000))
        self.assertEqual(result['status'], 'check_recording')
        self.assertEqual(result['active_signal_pct'], 0)
        self.assertTrue(result['recording_quality_only'])
        self.assertLessEqual(result['rms_dbfs'], -90)

    def test_ordinary_signal_has_finite_metrics(self):
        samples = [int(8000 * math.sin(2 * math.pi * 220 * n / 16000)) for n in range(16000)]
        result = analyze_wav(wav_of(samples))
        self.assertEqual(result['status'], 'signal_ok')
        self.assertEqual(result['duration_s'], 1.0)
        self.assertEqual(result['clipped_pct'], 0)
        self.assertGreater(result['rms_dbfs'], -35)
        self.assertLess(result['peak_dbfs'], 0)

    def test_clipping_is_reported(self):
        result = analyze_wav(wav_of([32767] * 16000))
        self.assertEqual(result['status'], 'check_recording')
        self.assertEqual(result['clipped_pct'], 100)
        self.assertTrue(any('clipping' in x for x in result['advice']))

    def test_quiet_signal_is_reported(self):
        result = analyze_wav(wav_of([100] * 16000))
        self.assertEqual(result['status'], 'check_recording')
        self.assertTrue(any('nhỏ' in x for x in result['advice']))

    def test_reject_wrong_sample_rate(self):
        with self.assertRaises(ValueError):
            analyze_wav(wav_of([0] * 16000, rate=44100))

    def test_reject_empty_or_invalid_audio(self):
        with self.assertRaises((ValueError, EOFError, wave.Error)):
            analyze_wav(b'not a wav')

    def test_short_signal_has_warning(self):
        result = analyze_wav(wav_of([5000] * 1600))
        self.assertEqual(result['status'], 'check_recording')
        self.assertTrue(any('ngắn' in x for x in result['advice']))


if __name__ == '__main__':
    unittest.main()
