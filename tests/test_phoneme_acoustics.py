"""Phase 6.3A feature-extraction tests; no installed MFA or Vosk required."""
import io
import math
from pathlib import Path
import struct
import sys
import unittest
import wave

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'pronunciation'))
from phoneme_acoustics import extract_phoneme_features


def pcm_wav(samples, rate=16000, channels=1):
    output = io.BytesIO()
    with wave.open(output, 'wb') as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(struct.pack('<'+'h' * len(samples), *samples))
    return output.getvalue()


class PhonemeAcousticsTest(unittest.TestCase):
    def test_sine_measurement_is_finite_and_not_a_pronunciation_score(self):
        samples = [int(10000 * math.sin(2 * math.pi * 250 * x / 16000)) for x in range(16000)]
        data = extract_phoneme_features(pcm_wav(samples), [
            {'phone':'W','start_s':0.1,'end_s':0.3},
            {'phone':'AA1','start_s':0.3,'end_s':0.5},
            {'phone':'T','start_s':0.5,'end_s':0.7},
            {'phone':'ER0','start_s':0.7,'end_s':0.9},
        ])
        self.assertEqual(data['source'], 'pcm16_mfa_interval_features')
        self.assertEqual(data['sample_rate_hz'], 16000)
        self.assertTrue(data['feature_only'])
        self.assertIsNone(data['pronunciation_score'])
        self.assertEqual([x['phone'] for x in data['intervals']], ['W','AA1','T','ER0'])
        for interval in data['intervals']:
            self.assertAlmostEqual(interval['duration_ms'], 200, places=1)
            self.assertTrue(-96 < interval['rms_dbfs'] < 0)
            self.assertTrue(-96 < interval['peak_dbfs'] <= 0)
            self.assertTrue(400 <= interval['zero_crossings_per_s'] <= 510)
            self.assertEqual(interval['clipped_pct'], 0)
            self.assertNotIn('accuracy', interval)

    def test_silence_is_not_good_pronunciation(self):
        data = extract_phoneme_features(pcm_wav([0] * 16000), [{'phone':'SH','start_s':0,'end_s':0.5}])
        self.assertEqual(data['intervals'][0]['rms_dbfs'],-96)
        self.assertEqual(data['intervals'][0]['zero_crossings_per_s'],0)
        self.assertIsNone(data['pronunciation_score'])

    def test_clipping_is_measured_without_grading(self):
        data = extract_phoneme_features(pcm_wav([32767 if i%2 else -32768 for i in range(16000)]),
                                        [{'phone':'S','start_s':0,'end_s':1}])
        self.assertEqual(data['intervals'][0]['clipped_pct'],100)
        self.assertLessEqual(data['intervals'][0]['zero_crossings_per_s'],16000)

    def test_scopes_energy_to_phone_span_not_whole_recording(self):
        samples = [0] * 8000 + [12000] * 8000
        data = extract_phoneme_features(pcm_wav(samples), [
            {'phone':'W','start_s':0,'end_s':0.5},
            {'phone':'AA1','start_s':0.5,'end_s':1},
        ])
        self.assertEqual(data['intervals'][0]['rms_dbfs'], -96)
        self.assertGreater(data['intervals'][1]['rms_dbfs'], -20)

    def test_rejects_malformed_mfa_intervals(self):
        wav = pcm_wav([1000] * 16000)
        cases = [[], [{'phone':'W','start_s':-1,'end_s':.1}],
                 [{'phone':'W','start_s':0,'end_s':1.5}],
                 [{'phone':'W','start_s':0,'end_s':math.nan}],
                 [{'phone':'W','start_s':False,'end_s':.5}],
                 [{'phone':'<script>','start_s':0,'end_s':.5}],
                 [{'phone':'W','start_s':0,'end_s':.8}, {'phone':'T','start_s':.4,'end_s':.9}]]
        for intervals in cases:
            with self.subTest(intervals=intervals), self.assertRaises(ValueError):
                extract_phoneme_features(wav, intervals)

    def test_rejects_bad_wav_and_wrong_sample_rate(self):
        with self.assertRaises((ValueError, wave.Error)):
            extract_phoneme_features(b'no audio', [{'phone':'W','start_s':0,'end_s':.1}])
        with self.assertRaises(ValueError):
            extract_phoneme_features(pcm_wav([0]*8000, rate=8000), [{'phone':'W','start_s':0,'end_s':.1}])

    def test_rejects_malformed_body_length(self):
        wav = pcm_wav([0] * 16000)
        with self.assertRaises((ValueError, wave.Error)):
            extract_phoneme_features(wav[:-10], [{'phone':'W','start_s':0,'end_s':.2}])

    def test_rejects_excessive_interval_count(self):
        with self.assertRaises(ValueError):
            extract_phoneme_features(pcm_wav([0]*16000), [{'phone':'A','start_s':0,'end_s':.01}]*41)


if __name__ == '__main__':
    unittest.main()
