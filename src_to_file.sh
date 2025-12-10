                #!/bin/bash

                # Define the output file and clear it first
                OUTPUT_FILE="llm.txt"
                echo "" > $OUTPUT_FILE
                echo "Starting NestJS source aggregation into $OUTPUT_FILE..."

                # --- 1. Include Key Configuration Files ---
                # These files provide critical context on dependencies and compilation settings.
                echo -e "\n--- CONFIGURATION FILES ---\n" >> $OUTPUT_FILE
                for config_file in package.json nest-cli.json tsconfig.json .env.example; do
                    if [ -f "$config_file" ]; then
                        echo -e "\n### FILE: $config_file ###" >> $OUTPUT_FILE
                        cat "$config_file" >> $OUTPUT_FILE
                        echo -e "\n---" >> $OUTPUT_FILE
                    fi
                done

                # --- 2. Process TypeScript Source Files ---
                # Find all .ts files within the 'src' directory, 
                # excluding all test files (*.spec.ts and *.e2e-spec.ts) and node_modules.
                find src -type f \( -name "*.ts" ! -name "*.spec.ts" ! -name "*.e2e-spec.ts" \) -print0 | while IFS= read -r -d $'\0' file; do
                    # Add a clear, unique file separator for the LLM context
                    echo -e "\n### FILE: $file ###" >> $OUTPUT_FILE
                    
                    # Concatenate the file content
                    cat "$file" >> $OUTPUT_FILE
                    
                    # Add a final separator
                    echo -e "\n---\n" >> $OUTPUT_FILE
                done

                echo "Successfully generated $OUTPUT_FILE containing the entire NestJS source code (excluding tests)."