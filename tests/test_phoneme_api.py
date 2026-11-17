"""Contract tests for optional /align endpoint; no installed MFA necessary."""
import json
from pathlib import Path
import sys
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch

PROJECT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT/'tests'))
import test_offline_api as existing
from phoneme_alignment import AlignmentUnavailable

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

    def test_wrong_accent_returns_bad_request(self):
        with patch.object(existing.servermod,'align_audio_mfa',side_effect=ValueError('US only')):
            with self.assertRaises(urllib.error.HTTPError) as resp:
                urllib.request.urlopen(self.request('en-GB'),timeout=5)
        self.assertEqual(resp.exception.code,400)

if __name__=='__main__':
    unittest.main()
