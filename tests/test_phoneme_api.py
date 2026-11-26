"""Contract tests for optional /align endpoint; no installed MFA necessary."""
import json
from pathlib import Path
import sys
import types
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch

PROJECT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT/'tests'))
import test_offline_api as existing
from phoneme_alignment import AlignmentUnavailable
import phoneme_alignment as mfa

class PhonemeAPIContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        existing.OfflineAPIContractTest.setUpClass()
        cls.url = existing.OfflineAPIContractTest.url

    @classmethod
    def tearDownClass(cls):
        existing.OfflineAPIContractTest.tearDownClass()

    @staticmethod
    def request(accent='en-US'):
        return urllib.request.Request(
            PhonemeAPIContractTest.url+'/api/pronunciation/align',
            data=existing.sample_wav(),
            headers={'Content-Type':'audio/wav','X-Expected-Word':'water','X-Practice-Accent':accent},
            method='POST'
        )

    def test_align_returns_separate_phoneme_schema(self):
        fake = {'source':'montreal_forced_aligner','phoneme_level_only':True,'pronunciation_score':None,'intervals':[{'phone':'W','start_s':.1,'end_s':.2}]}
        with patch.object(existing.servermod, 'align_audio_mfa', return_value=fake) as callback:
            with urllib.request.urlopen(self.request(),timeout=5) as response:
                self.assertEqual(response.status,200)
                payload=json.loads(response.read())
        self.assertEqual(payload['intervals'][0]['phone'],'W')
        callback.assert_called_once()

    def test_missing_mfa_is_helpful_service_unavailable(self):
        with patch.object(existing.servermod,'align_audio_mfa', side_effect=AlignmentUnavailable('Chưa cài MFA')):
            with self.assertRaises(urllib.error.HTTPError) as resp:
                urllib.request.urlopen(self.request(),timeout=5)
        self.assertEqual(resp.exception.code,503)
        self.assertIn('Chưa cài MFA', json.loads(resp.exception.read())['error'])

    def test_align_real_pipeline_includes_acoustic_features(self):
        # Mock only the external MFA process; exercise real backend, parser, PCM
        # extraction and JSON response together over HTTP.
        def simulated_mfa(cmd, **kwargs):
            import pathlib
            output = pathlib.Path(next(str(arg) for arg in cmd if str(arg).endswith('aligned.json')))
            output.write_text(json.dumps({
                'tiers': {'phones': {'type':'interval','entries': [
                    [.12,.27,'W'], [.27,.48,'AA1'], [.48,.70,'T'], [.70,.83,'ER0']
                ]}}
            }), encoding='utf-8')
            return types.SimpleNamespace(returncode=0)
        with patch.object(mfa,'_mfa_base_command',return_value=['mfa-fake']), \
             patch.object(mfa.subprocess,'run',side_effect=simulated_mfa):
            with urllib.request.urlopen(self.request(),timeout=5) as response:
                self.assertEqual(response.status,200)
                payload=json.loads(response.read())
        self.assertEqual(payload['status'],'aligned')
        self.assertTrue(payload['acoustic_features']['feature_only'])
        self.assertEqual(len(payload['acoustic_features']['intervals']),4)
        self.assertEqual(payload['acoustic_features']['intervals'][0]['phone'],'W')
        self.assertIsNone(payload['acoustic_features']['pronunciation_score'])

    def test_wrong_accent_returns_bad_request(self):
        with patch.object(existing.servermod,'align_audio_mfa',side_effect=ValueError('US only')):
            with self.assertRaises(urllib.error.HTTPError) as resp:
                urllib.request.urlopen(self.request('en-GB'),timeout=5)
        self.assertEqual(resp.exception.code,400)

if __name__=='__main__':
    unittest.main()
