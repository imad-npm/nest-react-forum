#!/bin/bash

# Aggregate both backend and frontend sources into one file for LLM context

OUTPUT_FILE="llm.txt"

# Clear previous output
echo "" > $OUTPUT_FILE
echo "Starting source aggregation into $OUTPUT_FILE..."

# --- 1. Include top-level config files ---
echo -e "\n--- CONFIGURATION FILES ---\n" >> $OUTPUT_FILE
for config_file in package.json nest-cli.json tsconfig.json .env.example; do
  if [ -f "$config_file" ]; then
    echo -e "\n### FILE: $config_file ###" >> $OUTPUT_FILE
    cat "$config_file" >> $OUTPUT_FILE
    echo -e "\n---" >> $OUTPUT_FILE
  fi
done

# --- 2. Aggregate backend/src ---
if [ -d "backend/src" ]; then
  echo -e "\n--- BACKEND SOURCE ---\n" >> $OUTPUT_FILE
  find backend/src -type f \( -name "*.ts" ! -name "*.spec.ts" ! -name "*.e2e-spec.ts" \) -print0 | \
  while IFS= read -r -d $'\0' file; do
    echo -e "\n### FILE: $file ###" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
    echo -e "\n---\n" >> $OUTPUT_FILE
  done
fi

# --- 3. Aggregate frontend/src ---
if [ -d "frontend/src" ]; then
  echo -e "\n--- FRONTEND SOURCE ---\n" >> $OUTPUT_FILE
  find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.spec.ts" -print0 | \
  while IFS= read -r -d $'\0' file; do
    echo -e "\n### FILE: $file ###" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
    echo -e "\n---\n" >> $OUTPUT_FILE
  done
fi

echo "Aggregation complete. Output written to $OUTPUT_FILE."
