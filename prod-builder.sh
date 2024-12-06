#!/bin/zsh

# This script is used to build the production image of the application

VERSION=0.3.7
IMAGE_NAME1=pavelbeard/wallet-backend.production
IMAGE_NAME2=pavelbeard/wallet-file-server.production
IMAGE_NAME3=pavelbeard/wallet-frontend.production

images=("${IMAGE_NAME1}" "${IMAGE_NAME2}" "${IMAGE_NAME3}")
dirs=("backend" "file-server" "frontend")

for i in {1..3}; do
  docker buildx build \
    --builder=timshee_builder \
    -t ${images[$i]}:${VERSION} \
    -t ${images[$i]}:latest \
    --platform linux/amd64,linux/arm64 \
    -f ./${dirs[$i]}/prod.Dockerfile ./${dirs[$i]} \
    --push;
done