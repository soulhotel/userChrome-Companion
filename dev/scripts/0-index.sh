#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THIS_SCRIPT="$(basename "${BASH_SOURCE[0]}")"
GREEN='\033[0;32m'; NC='\033[0m'

mapfile -t scripts < <(find "$SCRIPT_DIR" -maxdepth 1 -type f \( -name "*.sh" -o -name "*.js" \) ! -name "$THIS_SCRIPT" | sort)

for script in "${scripts[@]}"; do
  if [[ "$script" == *.sh ]] && [[ ! -x "$script" ]]; then
    chmod +x "$script"
  fi
done

echo -e "${GREEN}/////////////////////////////////////////////////////////////////${NC}\n"

if [[ ${#scripts[@]} -eq 0 ]]; then
  echo "no scripts found in $SCRIPT_DIR."
  exit 0
fi

for i in "${!scripts[@]}"; do
  printf "  %2d) %s\n" "$((i + 1))" "$(basename "${scripts[$i]}")"
done

echo ""
read -p "enter a script to run it (or press Enter to cancel): " selection

# Validate input and execute
if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#scripts[@]}" ]; then
  target="${scripts[$((selection - 1))]}"

  echo -e "\n${GREEN}/////////////////////////////////////////////////////////////////${NC}"
  echo -e "$(basename "$target")...\n"

  if [[ "$target" == *.js ]]; then
    node "$target"
  else
    bash "$target"
  fi
else
  echo -e "\n${GREEN}/////////////////////////////////////////////////////////////////${NC}"
fi