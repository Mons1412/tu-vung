"""IPA HTTP contract: no Vosk model or online dependency required."""
from __future__ import annotations
import json
import os
import pathlib
import sqlite3
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from unittest.mock import patch

PROJECT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT / 'pronunciation'))
from test_offline_api import servermod, fake_vosk


class IpaApiContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.db = pathlib.Path(cls.tmp.name) / 'ipa.sqlite'
        with sqlite3.connect(cls.db) as conn:
            conn.execute('CREATE TABLE pronunciations (word TEXT, accent TEXT, variant_index INTEGER, ipa TEXT, raw_ipa TEXT, source TEXT, notation_warning TEXT)')
            conn.execute('INSERT INTO pronunciations VALUES (?,?,?,?,?,?,?)', ('water','en-GB',1,'/wˈɔːtə/','w ˈɔː t ə','Britfone/3.0.1','raw'))
        cls.patch_env = patch.dict(os.environ, {'VOCAMINI_IPA_DB': str(cls.db)})
        cls.patch_env.start()
        cls.http = ThreadingHTTPServer(('127.0.0.1', 0), servermod.make_handler(fake_vosk.Model()))
        cls.url = f'http://127.0.0.1:{cls.http.server_address[1]}'
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown(); cls.http.server_close(); cls.thread.join(timeout=3)
        cls.patch_env.stop(); cls.tmp.cleanup()

    def test_get_local_ipa(self):
        with urllib.request.urlopen(self.url + '/api/pronunciation/ipa?word=water', timeout=5) as resp:
            self.assertEqual(resp.status, 200)
            self.assertEqual(resp.headers['Cache-Control'], 'no-store')
            data = json.load(resp)
        self.assertEqual(data['accents']['en-GB'][0]['ipa'], '/ˈwɔːtə/')
        self.assertEqual(data['accents']['en-US'], [])

    def test_rejects_invalid_query(self):
        for path in ('/api/pronunciation/ipa?word=two%20words',
                     '/api/pronunciation/ipa?word=water&accent=en-AU',
                     '/api/pronunciation/ipa?word=water&word=book'):
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(self.url + path, timeout=5)
            self.assertEqual(ctx.exception.code, 400)

if __name__ == '__main__': unittest.main()
