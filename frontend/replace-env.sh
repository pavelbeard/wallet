#!/bin/sh

# Loop through all secrets in the directory
for secret in /run/secrets/*; do
  # Extract the secret name (basename of the file)
  secret_name=$(basename "$secret")

  # Read the content of the secret file
  secret_value=$(cat "$secret")

  # Export the secret as an environment variable
  export "$secret_name"="$secret_value"
done

# Execute the provided command
exec "$@"