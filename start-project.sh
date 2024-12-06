#!/bin/bash

# Start the project

COMPOSE_FILE=docker-compose.yaml
SECRETS_FILE=.env.secrets.prod

mv $SECRETS_FILE .env.secrets

git stash
git pull

mv .env.secrets $SECRETS_FILE

docker-compose --env-file $SECRETS_FILE up -d