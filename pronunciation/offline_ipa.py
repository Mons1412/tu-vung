"""Read VocaMini's optional external, read-only US/UK pronunciation database.

The database deliberately stays OUTSIDE the served VocaMini document root.
This is a pronunciation reference, never pronunciation correctness scoring.
"""
from __future__ import annotations

import os
import re
import sqlite3
from contextlib import closing
from pathlib import Path

DEFAULT_DB = (Path.home() / 'Projects' / 'ipa-datasets' / 'vocamini_ipa_offline_package'
              / 'output' / 'vocamini_ipa_offline_v0_1.sqlite')
ALLOWED_ACCENTS = ('en-US', 'en-GB')
WORD_PATTERN = re.compile(r"[a-z][a-z'-]{0,63}\Z")
VOWEL_SYMBOLS = 'aeiouɑɐæʌəɘɜɞɛɪɨɒɔøœʊʉɯɤyʏɚɝɵ'


class IpaDbUnavailable(RuntimeError):
    """Database not installed or unavailable."""


def database_path() -> Path:
    return Path(os.environ.get('VOCAMINI_IPA_DB') or DEFAULT_DB).expanduser().resolve()


def normalize_britfone_stress(ipa: str) -> tuple[str, str | None]:
    """Move the main stress to word start ONLY for a certainly stressed first syllable.

    Britfone writes the primary stress immediately before a stressed vowel.
    On later syllables, onset placement needs syllabification: keep original
    notation and explicitly warn rather than silently guessing.
    """
    if not ipa.startswith('/') or not ipa.endswith('/'):
        return ipa, 'Ký pháp Britfone cần đối chiếu trước khi hiển thị.'
    body = ipa[1:-1]
    if body.count('ˈ') != 1 or 'ˌ' in body:
        return ipa, 'Dấu trọng âm Britfone đặt trước nguyên âm; chưa chuẩn hóa ranh giới âm tiết.'
    idx = body.index('ˈ')
    if idx == 0:
        return ipa, None
    if not any(c in VOWEL_SYMBOLS for c in body[:idx]):
        return '/ˈ' + body.replace('ˈ', '', 1) + '/', None
    return ipa, 'Dấu trọng âm Britfone đặt trước nguyên âm; không chắc ranh giới âm tiết.'


def lookup(word: str, accent: str | None = None, db_path: Path | None = None) -> dict:
    key = word.strip().lower() if isinstance(word, str) else ''
    if not WORD_PATTERN.fullmatch(key):
        raise ValueError('Từ tra cứu không hợp lệ (chỉ chấp nhận một từ tiếng Anh).')
    if accent is not None and accent not in ALLOWED_ACCENTS:
        raise ValueError('Chỉ hỗ trợ giọng en-US và en-GB.')
    accents = (accent,) if accent else ALLOWED_ACCENTS
    db = Path(db_path or database_path()).expanduser().resolve()
    if not db.is_file():
        raise IpaDbUnavailable('Chưa tìm thấy IPA offline database. Kiểm tra VOCAMINI_IPA_DB.')
    try:
        # SQLite URI must quote unusual characters in path, and mode=ro prevents
        # writes. Database is never copied beneath the static web root.
        from urllib.parse import quote
        uri = f"file:{quote(str(db), safe='/')}?mode=ro"
        with closing(sqlite3.connect(uri, uri=True, timeout=3)) as conn:
            conn.row_factory = sqlite3.Row
            conn.execute('PRAGMA query_only=ON')
            response = {'word': key, 'accents': {}}
            for locale in accents:
                rows = conn.execute('''SELECT variant_index, ipa, raw_ipa, source,
                        notation_warning FROM pronunciations
                        WHERE word=? AND accent=? ORDER BY variant_index LIMIT 12''',
                        (key, locale)).fetchall()
                variants = []
                for row in rows:
                    candidate = row['ipa']
                    if not isinstance(candidate, str) or not candidate.startswith('/') or not candidate.endswith('/') or len(candidate) > 160:
                        continue
                    warning = row['notation_warning']
                    if locale == 'en-GB' and row['source'] == 'Britfone/3.0.1':
                        candidate, note = normalize_britfone_stress(candidate)
                        warning = note  # Keep warning only where not safely converted.
                    variants.append({
                        'variant_index': row['variant_index'],
                        'ipa': candidate,
                        'source': row['source'],
                        'notation_warning': warning,
                    })
                response['accents'][locale] = variants
            return response
    except sqlite3.Error as error:
        raise IpaDbUnavailable('Không thể đọc dữ liệu IPA offline.') from error
