# VocaMini — Development Checkpoint

Date: 2026-11-27

## Completed

- Phase 6.3A: Acoustic Features
- Automatic microphone recording
- Automatic Vosk recognition after recording
- Accent-Aware IPA UK/US
- Pronunciation Insights
- IPA Offline Integration v1.0
- SQLite IPA dataset preparation

## Tests

- JavaScript: 35/35 PASS
- Python: 44/44 PASS
- Offline SQLite package: 4/4 PASS

Total integration tests: 79/79 PASS.

## IPA Dataset

Database location:

/home/mons1412/Projects/ipa-datasets/vocamini_ipa_offline_package/output/vocamini_ipa_offline_v0_1.sqlite

The dataset is stored outside the Git repository.

## Important

The updated backend could not start because port 5500
was occupied by an older server.

Live IPA API and Firefox end-to-end acceptance
are not yet confirmed.

## Next Session

1. Stop the old backend using port 5500.
2. Start the updated backend with VOCAMINI_IPA_DB.
3. Verify /api/pronunciation/ipa returns HTTP 200.
4. Test IPA switching UK/US in Firefox.
5. Improve Britfone stress normalization.
6. Develop Syllable Analysis v2.0.
7. Continue Phase 6.3B Pronunciation Assessment.

## Backend startup

cd ~/Projects/tu-vung
source ~/miniforge3/etc/profile.d/conda.sh
conda activate vocamini-aligner
unset VOCAMINI_MFA_EXE

export VOCAMINI_IPA_DB="$HOME/Projects/ipa-datasets/vocamini_ipa_offline_package/output/vocamini_ipa_offline_v0_1.sqlite"

./.venv/bin/python pronunciation/offline_server.py

## Safety

- Do not commit local ML models, virtual environments,
  microphone recordings or the SQLite dataset by accident.
- Do not treat MFA forced alignment as a pronunciation score.
- Preserve the original IPA dataset and pronunciation variants.
