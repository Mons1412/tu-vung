"""HTTP integration tests with fake Vosk recognition (no actual model needed)."""

import io
import importlib.util
import json
import math
import pathlib
import struct
import sys
import threading
import types
import unittest
import urllib.error
import urllib.request
import wave
from http.server import ThreadingHTTPServer

PROJECT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT / 'pronunciation'))

class FakeRecognizer:
    def __init__(self, model, sample_rate):
        self.sample_rate = sample_rate
    def SetWords(self, enabled):
        self.words = enabled
    def AcceptWaveform(self, chunk):
        return False
    def FinalResult(self):
        return '{"text":"water","result":[{"word":"water","start":0.12,"end":0.83,"conf":0.98}]}'
    def Result(self):
        return '{"text":""}'

fake_vosk = types.ModuleType('vosk')
fake_vosk.KaldiRecognizer = FakeRecognizer
fake_vosk.Model = type('FakeModel', (), {})
fake_vosk.SetLogLevel = lambda level: None
sys.modules['vosk'] = fake_vosk
spec = importlib.util.spec_from_file_location('vocamini_offline_server_test', PROJECT / 'pronunciation' / 'offline_server.py')
servermod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(servermod)


def sample_wav():
    buf = io.BytesIO()
    samples = [int(5000 * math.sin(2 * math.pi * 230 * n / 16000)) for n in range(16000)]
    with wave.open(buf, 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(16000)
        f.writeframes(struct.pack('<' + 'h' * len(samples), *samples))
    return buf.getvalue()


class OfflineAPIContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.http = ThreadingHTTPServer(('127.0.0.1', 0), servermod.make_handler(fake_vosk.Model()))
        cls.url = f'http://127.0.0.1:{cls.http.server_address[1]}'
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown()
        cls.http.server_close()
        cls.thread.join(timeout=3)

    def test_recognize_returns_json_with_diagnostics(self):
        req = urllib.request.Request(
            self.url + '/api/pronunciation/recognize',
            data=sample_wav(),
            headers={'Content-Type':'audio/wav','X-Expected-Word':'water'},
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            self.assertTrue(response.headers['Content-Type'].startswith('application/json'))
            data = json.loads(response.read())
        self.assertTrue(data['matched'])
        self.assertEqual(data['recognized'], 'water')
        self.assertTrue(data['recognition_only'])
        self.assertEqual(data['recording_quality']['duration_s'], 1.0)
        self.assertTrue(data['recording_quality']['recording_quality_only'])
        self.assertTrue(data['word_timing']['word_level_only'])
        self.assertEqual(data['word_timing']['expected_span'], {'start_s': 0.12, 'end_s': 0.83})

    def test_invalid_wav_returns_json_error(self):
        req = urllib.request.Request(
            self.url + '/api/pronunciation/recognize',
            data=b'A' * 128,
            headers={'Content-Type':'audio/wav','X-Expected-Word':'water'},
            method='POST'
        )
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(req)
        self.assertEqual(ctx.exception.code, 400)
        self.assertIn('error', json.loads(ctx.exception.read()))

    def test_models_folder_is_not_exposed(self):
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(self.url + '/models/model.conf')
        self.assertEqual(ctx.exception.code, 403)

if __name__ == '__main__':
    unittest.main()
