#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
OUT_DIR="${ROOT_DIR}/dev/data"
OUT_FILE="${OUT_DIR}/tree.txt"
IGNORE_THIS_TOO="dev-documentation|documentation" # will rename eventually

cd "${ROOT_DIR}"
echo
echo "project root: ${ROOT_DIR}"

if ! command -v tree &>/dev/null; then
  echo "'tree' command not found" >&2
  echo
  exit 1
fi

if [[ ! -f ".gitignore" ]]; then
  echo "${ROOT_DIR} is missing '.gitignore'" >&2
  echo
  mkdir -p "${OUT_DIR}"
  tree -I "${IGNORE_THIS_TOO}" . -o "${OUT_FILE}"
else
  mkdir -p "${OUT_DIR}"
  tree --gitignore -I "${IGNORE_THIS_TOO}" . -o "${OUT_FILE}"
fi


echo "tree: written to ${OUT_FILE}"
echo