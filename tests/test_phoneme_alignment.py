"""MFA parser and command contract, independent from any MFA installation."""

import io
import json
from pathlib import Path
import math
import sys
import struct
import types
import unittest
from unittest.mock import patch
import wave

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'pronunciation'))
import phoneme_alignment as mfa


def wav_bytes():
    out = io.BytesIO()
    with wave.open(out, 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(16000)
        f.writeframes(struct.pack('<' + 'h' * 16000, *([1000] * 16000)))
    return out.getvalue()


def mfa_response():
    return {'start': 0, 'end': 1, 'tiers': {
        'words': {'type': 'interval', 'entries': [[0.11, .91, 'water']]},
        'phones': {'type': 'interval', 'entries': [
            [0.0, .10, 'sil'], [.11, .21, 'W'], [.21, .44, 'AO1'],
            [.44, .65, 'T'], [.65, .91, 'ER0'], [.91, 1.0, 'sil']
        ]}
    }}


class MFAParserTest(unittest.TestCase):
    def test_actual_json_phone_intervals(self):
        data = mfa.parse_mfa_json(mfa_response(), 'water', 1.0)
        self.assertEqual([x['phone'] for x in data['intervals']], ['W','AO1','T','ER0'])
        self.assertEqual(data['source'], 'montreal_forced_aligner')
        self.assertTrue(data['phoneme_level_only'])
        self.assertIsNone(data['pronunciation_score'])
        self.assertEqual(data['phone_set'], 'ARPABET')

    def test_speaker_tier_names(self):
        obj = {'tiers': {'speaker_1 - phones': {'type':'interval','entries': [[.1,.4,'SH']]}}}
        self.assertEqual(mfa.parse_mfa_json(obj,'ship',1)['intervals'][0]['phone'], 'SH')

    def test_reject_missing_phones(self):
        with self.assertRaises(mfa.AlignmentFailed):
            mfa.parse_mfa_json({'tiers':{'words':{}}}, 'water', 1)

    def test_reject_overlapping_and_out_of_range(self):
        for bad in ([[.1,.3,'W'],[.2,.5,'AO1']], [[.1,1.5,'W']], [[.1,.3,'<script>']]):
            with self.subTest(bad=bad), self.assertRaises(mfa.AlignmentFailed):
                mfa.parse_mfa_json({'tiers':{'phones':{'entries':bad}}},'water',1)

    def test_reject_nan_and_non_numeric(self):
        for a in (math.nan, 'hello', True):
            with self.subTest(a=a), self.assertRaises(mfa.AlignmentFailed):
                mfa.parse_mfa_json({'tiers':{'phones':{'entries':[[a,.5,'W']]}}},'water',1)

    def test_reject_multitoken_and_injection(self):
        for s in ('hello world','water & whoami','water;Remove-Item','tín',''):
            with self.subTest(s=s), self.assertRaises(ValueError):
                mfa.validate_expected_word(s)

    def test_reject_wrong_accent_before_launch(self):
        with self.assertRaises(ValueError):
            mfa.align_audio_mfa(wav_bytes(),'water','en-GB')

    def test_wav_format(self):
        self.assertEqual(mfa.duration_of_wav(wav_bytes()),1)
        with self.assertRaises(ValueError):
            mfa.duration_of_wav(b'not a wav')

    def test_command_calls_real_align_one_and_cleans_temporary_audio(self):
        observed = []
        def fake_run(cmd, **kwargs):
            self.assertEqual(cmd[:2], ['mfa-test', 'align_one'])
            self.assertIn('--output_format', cmd)
            self.assertIn('english_us_arpa', cmd)
            sound = Path(next(x for x in cmd if str(x).endswith('sample.wav')))
            transcript = Path(next(x for x in cmd if str(x).endswith('sample.txt')))
            output = Path(next(x for x in cmd if str(x).endswith('aligned.json')))
            self.assertTrue(sound.is_file())
            self.assertEqual(transcript.read_text('utf-8'), 'water\n')
            observed.append(sound)
            output.write_text(json.dumps(mfa_response()), encoding='utf-8')
            return types.SimpleNamespace(returncode=0)
        with patch.object(mfa,'_mfa_base_command',return_value=['mfa-test']), patch.object(mfa.subprocess,'run',side_effect=fake_run):
            data = mfa.align_audio_mfa(wav_bytes(),'water','en-US')
        self.assertEqual(len(data['intervals']),4)
        self.assertTrue(data['acoustic_features']['feature_only'])
        self.assertEqual(len(data['acoustic_features']['intervals']), 4)
        self.assertIsNone(data['acoustic_features']['pronunciation_score'])
        self.assertFalse(observed[0].exists())

    def test_failed_mfa_does_not_leave_temporary_audio(self):
        observed=[]
        def fail(cmd, **kwargs):
            observed.append(Path(next(x for x in cmd if str(x).endswith('sample.wav'))))
            return types.SimpleNamespace(returncode=1)
        with patch.object(mfa,'_mfa_base_command',return_value=['mfa-test']), patch.object(mfa.subprocess,'run',side_effect=fail):
            with self.assertRaises(mfa.AlignmentFailed):
                mfa.align_audio_mfa(wav_bytes(),'water','en-US')
        self.assertFalse(observed[0].exists())

if __name__=='__main__':
    unittest.main()
