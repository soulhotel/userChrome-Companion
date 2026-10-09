#!/bin/bash

# a compiled version of the themes Release Notes (changelog)

set -e

INPUT_FILE="changelog.md"
OUTPUT_FILE="dev/docs/Version History.md"
TMP_FILE=$(mktemp)

# changelog.md always records version number at the top like this
VERSION=$(grep -m1 "^### <ins> userChrome Companion " "$INPUT_FILE" | sed -E 's/^### <ins> userChrome Companion ([0-9.]+) Release.*$/\1/')
echo "## <ins> $VERSION </ins>" >> "$TMP_FILE"
echo >> "$TMP_FILE"

IN_CHANGELOG=0
APPEND_MEDIA=0
SKIP_COMMENT=0

# need to rewrite this one, different format than ffu