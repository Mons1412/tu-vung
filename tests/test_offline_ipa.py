"""Portable tests: create a minimal IPA fixture, never depend on user's DB."""
import os
import pathlib
import sqlite3
import sys
import tempfile
import unittest
from unittest.mock import patch

PROJECT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT / 'pronunciation'))
from offline_ipa import IpaDbUnavailable, lookup, normalize_britfone_stress


class OfflineIpaTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = pathlib.Path(self.tmp.name) / 'test.sqlite'
        conn = sqlite3.connect(self.db)
        conn.execute('''CREATE TABLE pronunciations (
            word TEXT, accent TEXT, variant_index INTEGER, ipa TEXT,
            raw_ipa TEXT, source TEXT, notation_warning TEXT)''')
        conn.executemany('INSERT INTO pronunciations VALUES (?,?,?,?,?,?,?)', [
            ('water', 'en-US', 1, '/ˈwɔtɝ/', '/ˈwɔtɝ/', 'ipa-dict/en_US', None),
            ('water', 'en-GB', 1, '/wˈɔːtə/', 'w ˈɔː t ə', 'Britfone/3.0.1', 'raw'),
            ('schedule', 'en-GB', 1, '/ʃˈɛdʒuːl/', 'ʃ ˈɛ dʒ uː l', 'Britfone/3.0.1', 'raw'),
            ('schedule', 'en-GB', 2, '/skˈɛdʒuːl/', 's k ˈɛ dʒ uː l', 'Britfone/3.0.1', 'raw'),
            ('about', 'en-GB', 1, '/əbˈaʊt/', 'ə b ˈaʊ t', 'Britfone/3.0.1', 'raw'),
        ])
        conn.commit(); conn.close()

    def tearDown(self):
        self.tmp.cleanup()

    def test_accents_and_variants_are_preserved(self):
        got = lookup('  SCHEDULE ', db_path=self.db)
        self.assertEqual(len(got['accents']['en-GB']), 2)
        self.assertEqual(got['accents']['en-GB'][0]['ipa'], '/ˈʃɛdʒuːl/')
        self.assertEqual(got['accents']['en-GB'][1]['ipa'], '/ˈskɛdʒuːl/')
        self.assertEqual(got['accents']['en-US'], [])

    def test_britfone_first_vowel_stress_converts_conservatively(self):
        got = lookup('water', db_path=self.db)
        self.assertEqual(got['accents']['en-GB'][0]['ipa'], '/ˈwɔːtə/')
        self.assertIsNone(got['accents']['en-GB'][0]['notation_warning'])
        self.assertEqual(got['accents']['en-US'][0]['ipa'], '/ˈwɔtɝ/')

    def test_later_stress_not_guessed(self):
        got = lookup('about', 'en-GB', db_path=self.db)
        self.assertEqual(got['accents']['en-GB'][0]['ipa'], '/əbˈaʊt/')
        self.assertTrue(got['accents']['en-GB'][0]['notation_warning'])
        self.assertEqual(normalize_britfone_stress('/əˈbaʊt/')[0], '/əˈbaʊt/')

    def test_rejects_invalid_and_missing_database(self):
        for key in ('', 'hello world', '../../etc/passwd', 'a'*65):
            with self.assertRaises(ValueError, msg=key):
                lookup(key, db_path=self.db)
        with self.assertRaises(ValueError):
            lookup('water', 'en-AU', db_path=self.db)
        with self.assertRaises(IpaDbUnavailable):
            lookup('water', db_path=self.db.with_name('none.sqlite'))

    def test_readonly(self):
        with patch.dict(os.environ, {'VOCAMINI_IPA_DB': str(self.db)}):
            self.assertEqual(lookup('water')['accents']['en-US'][0]['source'], 'ipa-dict/en_US')

if __name__ == '__main__':
    unittest.main()
