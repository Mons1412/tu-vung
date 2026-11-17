"""Phase 6.2a word timestamps: never mislabel them as phoneme alignment."""
import unittest
from test_offline_api import servermod, sample_wav, fake_vosk

class WordTimingTest(unittest.TestCase):
    def test_vosk_timestamps_for_target(self):
        text, data = servermod.recognize_with_word_timing(fake_vosk.Model(), sample_wav(), 'water')
        self.assertEqual(text, 'water')
        self.assertEqual(data['source'], 'vosk_word_timestamps')
        self.assertTrue(data['word_level_only'])
        self.assertNotIn('phonemes', data)
        self.assertEqual(data['intervals'], [{'word':'water', 'start_s':0.12, 'end_s':0.83}])
        self.assertEqual(data['expected_span'], {'start_s':0.12, 'end_s':0.83})

    def test_no_matching_target_has_no_span(self):
        _, data = servermod.recognize_with_word_timing(fake_vosk.Model(), sample_wav(), 'ship')
        self.assertIsNone(data['expected_span'])

    def test_reject_invalid_or_out_of_range_times(self):
        results = [{'result': [
            {'word':'water','start':0.1,'end':0.6},
            {'word':'bad','start':0.2,'end':0.3},
            {'word':'inf','start':float('inf'),'end':0.9},
            {'word':'wrong','start':2,'end':3},
            {'word':'end','start':0.7,'end':0.93}
        ]}]
        self.assertEqual([x['word'] for x in servermod.valid_word_intervals(results,1.0)], ['water', 'end'])

    def test_no_word_timestamps_does_not_invent_boundaries(self):
        result = [{'text': 'water'}]
        self.assertEqual(servermod.valid_word_intervals(result, 1.0), [])
        self.assertIsNone(servermod.expected_word_span([], 'water'))

    def test_multiword_contiguous_match(self):
        intervals = [{'word':'good','start_s':0.1,'end_s':0.3},
                     {'word':'morning','start_s':0.4,'end_s':0.9}]
        self.assertEqual(servermod.expected_word_span(intervals, 'good morning'),
                         {'start_s':0.1, 'end_s':0.9})
        self.assertIsNone(servermod.expected_word_span(intervals, 'morning good'))

if __name__ == '__main__':
    unittest.main()
