#!/bin/bash

# a compiled version of the themes Release Notes (changelog)

set -e

INPUT_FILE="changelog.md"
OUTPUT_FILE="dev/docs/Version History.md"
TMP_FILE=$(mktemp)

# changelog.md always has a version header like this:

HEADER=$(grep -m1 "^### <ins> userChrome Companion " "$INPUT_FILE" | sed -E 's/\r$//; s/[[:space:]]+$//' || true)
VERSION=$(echo "$HEADER" | sed -E 's/^### <ins> userChrome Companion ([0-9][0-9.]*).*$/\1/')

if [[ -z "$HEADER" ]]; then
    echo "version header not found, recheck $INPUT_FILE"
    exit 1
fi
echo "$HEADER" >> "$TMP_FILE"
echo >> "$TMP_FILE"

# and eventually a change log header that we log content from:

IN_CHANGELOG=0
APPEND_MEDIA=0
IN_COMMENT=0
STARTED=0
PENDING_BLANKS=0

while IFS= read -r line || [[ -n "$line" ]]; do
    line=${line%$'\r'}
    if [[ "$line" =~ ^###\ \<ins\>\ Change\ Log ]]; then
        IN_CHANGELOG=1
        echo "$line" | sed -E 's/[[:space:]]+$//' >> "$TMP_FILE"
        continue
    fi
    if [[ $IN_CHANGELOG -eq 1 && "$line" =~ ^###\  ]]; then
        IN_CHANGELOG=0
        APPEND_MEDIA=1
        continue
    fi

    if [[ $IN_COMMENT -eq 1 ]]; then
        [[ "$line" == *"-->"* ]] && IN_COMMENT=0
        continue
    fi
    if [[ "$line" =~ ^[[:space:]]*\<!-- ]]; then
        [[ "$line" != *"-->"* ]] && IN_COMMENT=1
        continue
    fi

    if [[ $IN_CHANGELOG -eq 1 ]]; then
        if [[ -z "${line//[[:space:]]/}" ]]; then
            [[ $STARTED -eq 1 ]] && PENDING_BLANKS=$((PENDING_BLANKS + 1))
        else
            while [[ $PENDING_BLANKS -gt 0 ]]; do
                echo "" >> "$TMP_FILE"
                PENDING_BLANKS=$((PENDING_BLANKS - 1))
            done
            echo "$line" >> "$TMP_FILE"
            STARTED=1
        fi
    fi

# we also pass along any forms of media through out the changelog

    if [[ $APPEND_MEDIA -eq 1 ]]; then
        # images ![](...)
        if echo "$line" | grep -q '!\[.*\](.*)'; then
            url=$(echo "$line" | sed -E 's/.*!\[[^]]*\]\(([^)]+)\).*/\1/')
            echo "" >> "$TMP_FILE"
            echo "<img width=\"100%\" src=\"$url\" />" >> "$TMP_FILE"
        # videos
        elif [[ "$line" =~ ^https://github\.com/user-attachments/assets/ ]]; then
            url="$line"
            echo "" >> "$TMP_FILE"
            echo "<iframe width=\"100%\" height=\"490\" src=\"$url\" title=\"GitHub video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>" >> "$TMP_FILE"
        fi
    fi

done < "$INPUT_FILE"

# to the top
if [[ -f "$OUTPUT_FILE" ]]; then
    {
        cat "$TMP_FILE"
        echo ""
        cat "$OUTPUT_FILE"
    } > "${OUTPUT_FILE}.tmp"
    mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"
else
    mkdir -p "$(dirname "$OUTPUT_FILE")"
    mv "$TMP_FILE" "$OUTPUT_FILE"
fi

rm -f "$TMP_FILE"
echo "$VERSION added to $OUTPUT_FILE"