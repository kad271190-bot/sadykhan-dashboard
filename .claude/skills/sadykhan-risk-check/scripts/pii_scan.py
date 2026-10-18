#!/usr/bin/env python3
"""Поиск персональных данных и секретов перед переносом данных или коммитом.

Использование:
  pii_scan.py <файл или папка> [...]   — проверить данные перед загрузкой
  pii_scan.py --git [--range A..B]     — проверить добавленные строки (staged + рабочая копия, или диапазон коммитов)
Код возврата 1 — найдены блокирующие совпадения (BLOCK), 0 — нет. WARN — проверить глазами.
"""
import os, re, subprocess, sys

ALLOW = ('noreply@anthropic.com', 'example.com', '@sadykhan.kz')  # демо-адреса из интерфейса
RULES = [
    ('BLOCK', 'секрет: вебхук Bitrix24', re.compile(r'/rest/\d+/[a-z0-9]{8,}/', re.I)),
    ('BLOCK', 'секрет: ключ API', re.compile(r'\b(sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16})\b')),
    ('BLOCK', 'секрет: пароль/токен в значении', re.compile(r'(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*["\'][^"\']{8,}["\']', re.I)),
    ('BLOCK', 'телефон', re.compile(r'(?<!\d)(\+7|8)[\s(-]*7\d{2}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}(?!\d)')),
    ('BLOCK', 'e-mail', re.compile(r'[\w.+-]+@[\w-]+\.[\w.-]+')),
    ('BLOCK', 'дата рождения', re.compile(r'(дата рождения|д\.\s?р\.|birth)', re.I)),
    ('WARN', 'ФИО «Фамилия И.О.»', re.compile(r'\b[А-ЯЁ][а-яё]{2,}\s+[А-ЯЁ]\.\s?[А-ЯЁ]\.')),
    ('WARN', 'ФИО «И. Фамилия»', re.compile(r'(?<![А-ЯЁA-Z.])[А-ЯЁ]\.\s?[А-ЯЁ][а-яё]{3,}(?:ов|ев|ин|ова|ева|ина|ский|ская)\b')),
    ('WARN', '12-значный номер (ИИН/БИН)', re.compile(r'(?<!\d)\d{12}(?!\d)')),
]

def scan_lines(lines, where, git_mode):
    hits = []
    for n, line in lines:
        if '(тест)' in line:  # вымышленные демо-персонажи
            continue
        for level, name, rx in RULES:
            for m in rx.finditer(line):
                s = m.group(0)
                if name == 'e-mail' and any(a in s for a in ALLOW):
                    continue
                lv = level
                if name.startswith('12-значный'):
                    ctx = line[max(0, m.start() - 120):m.end() + 40]
                    lv = 'BLOCK' if (git_mode or re.search(r'\bИП\b|индивидуальн', ctx)) else 'WARN'
                hits.append((lv, name, f'{where}:{n}', s[:60]))
    return hits

def file_lines(path):
    try:
        with open(path, encoding='utf-8', errors='ignore') as f:
            return list(enumerate(f, 1))
    except OSError:
        return []

def git_added(rng):
    cmds = [['git', 'diff', '-U0', rng]] if rng else [['git', 'diff', '--cached', '-U0'], ['git', 'diff', '-U0']]
    out = []
    for c in cmds:
        diff = subprocess.run(c, capture_output=True, text=True).stdout
        cur, ln = '?', 0
        for row in diff.splitlines():
            if row.startswith('+++ '):
                cur = row[6:] if row.startswith('+++ b/') else row[4:]
            elif row.startswith('@@'):
                m = re.search(r'\+(\d+)', row); ln = int(m.group(1)) if m else 0
            elif row.startswith('+') and not row.startswith('+++'):
                out.append((cur, ln, row[1:])); ln += 1
    return out

def main(argv):
    hits = []
    if '--git' in argv:
        rng = argv[argv.index('--range') + 1] if '--range' in argv else None
        for path, n, text in git_added(rng):
            if path.endswith('pii_scan.py'):
                continue
            hits += scan_lines([(n, text)], path, True)
    else:
        paths = [a for a in argv if not a.startswith('--')]
        if not paths:
            print(__doc__); return 2
        for p in paths:
            files = [os.path.join(r, f) for r, _, fs in os.walk(p) for f in fs] if os.path.isdir(p) else [p]
            for f in files:
                if f.lower().endswith(('.json', '.txt', '.md', '.csv', '.html', '.js', '.py', '.ts', '.tsx')):
                    hits += scan_lines(file_lines(f), f, False)
    block = [h for h in hits if h[0] == 'BLOCK']
    for h in hits[:200]:
        print(f'{h[0]:5} {h[1]:28} {h[2]}  «{h[3]}»')
    print(f'Итого: BLOCK {len(block)}, WARN {len(hits) - len(block)}')
    return 1 if block else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
