#!/usr/bin/env python3
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORPUS_DIR = ROOT / "corpus"
OUT_DIR = ROOT / "src" / "assets" / "parsed"
DIC_DIR = ROOT / "unidic-chuko-v202512"

SOURCE_RE = re.compile(r"^\s*(?:#\s*)?source\s*:\s*(.+)$", re.IGNORECASE)


def resolve_source_and_text(raw_text: str, fallback_source: str) -> tuple[str, str]:
    lines = raw_text.splitlines()
    if not lines:
        return fallback_source, ""
    match = SOURCE_RE.match(lines[0])
    if match:
        source = match.group(1).strip() or fallback_source
        body = "\n".join(lines[1:]).strip()
        return source, body
    return fallback_source, raw_text.strip()


def parse_with_mecab(text: str) -> list[dict]:
    result = subprocess.run(
        ["mecab", "-d", str(DIC_DIR)],
        input=text,
        text=True,
        capture_output=True,
        check=True,
    )
    tokens: list[dict] = []
    for line in result.stdout.splitlines():
        if not line or line == "EOS":
            continue
        if "\t" in line:
            surface, feature = line.split("\t", 1)
        else:
            surface, feature = line, ""
        features = feature.split(",") if feature else []
        pos = features[0] if len(features) > 0 else ""
        base = (
            features[7]
            if len(features) > 7 and features[7] != "*"
            else (
                features[6]
                if len(features) > 6 and features[6] != "*"
                else surface
            )
        )
        reading = (
            features[9]
            if len(features) > 9 and features[9] != "*"
            else (
                features[6]
                if len(features) > 6 and features[6] != "*"
                else surface
            )
        )
        tokens.append(
            {
                "surface": surface,
                "base": base,
                "pos": pos,
                "reading": reading,
            }
        )
    return tokens


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not CORPUS_DIR.exists():
        raise SystemExit(f"Corpus dir not found: {CORPUS_DIR}")

    corpus_files = sorted(CORPUS_DIR.glob("*.txt"))
    if not corpus_files:
        raise SystemExit("No corpus files found in corpus/*.txt")

    for path in corpus_files:
        raw_text = path.read_text(encoding="utf-8")
        source, body = resolve_source_and_text(raw_text, path.stem)
        if not body:
            continue
        tokens = parse_with_mecab(body)
        sample = {
            "text": body,
            "source": source,
            "tokens": tokens,
        }
        out_path = OUT_DIR / f"{path.stem}.json"
        out_path.write_text(
            json.dumps(sample, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"wrote {out_path.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
