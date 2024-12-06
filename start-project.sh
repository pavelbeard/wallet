#!/bin/bash

# Start the project

COMPOSE_FILE=docker-compose.yaml
SECRETS_FILE=.env.secrets.prod

if git diff --name-only HEAD~1 HEAD | grep "$SECRETS_FILE"; then
  echo "Compose file has changed, restarting containers..."

  # preserve old secrets
  if [ -f "$SECRETS_FILE" ]; then
    echo "Preserving old secrets... $SECRETS_FILE"
    mv "$SECRETS_FILE" "$SECRETS_FILE.old"
  fi

  # update code 
  git stash
  git pull

  # replace with new secrets
  if [ -f "$SECRETS_FILE.new" ]; then
    echo "Replacing secrets... $SECRETS_FILE.new"
    mv "$SECRETS_FILE.new" "$SECRETS_FILE"
  fi

  echo "Restarting project..."
  docker-compose -f "$COMPOSE_FILE" up -d --remove-orphans --force-recreate
else
  echo "Compose file has not changed, but containers will be restarted by watchtower automatically."
fi