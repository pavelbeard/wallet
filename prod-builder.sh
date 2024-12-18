#!/bin/zsh

# This script is used to build the production image of the application

VERSION=0.3.95
IMAGE_NAME1="pavelbeard/wallet-backend.production"
IMAGE_NAME2="pavelbeard/wallet-file-server.production"
IMAGE_NAME3="pavelbeard/wallet-frontend.production"

images=("${IMAGE_NAME1}" "${IMAGE_NAME2}" "${IMAGE_NAME3}")
dirs=("backend" "file-server" "frontend")

# Function to build Docker images
build_image() {
  local image_name=$1
  local dir=$2

  docker buildx build \
    --builder=timshee_builder \
    -t "${image_name}:${VERSION}" \
    -t "${image_name}:latest" \
    --platform linux/amd64,linux/arm64 \
    -f "./${dir}/prod.Dockerfile" "./${dir}" \
    --push
}

# Main logic
if [ -z "$1" ]; then
  # Build all images if no argument is passed
  for i in {1..3}; do
    build_image "${images[$i]}" "${dirs[$i]}"
  done

elif [ "$1" = "django" ]; then
  build_image "${IMAGE_NAME1}" "backend"

elif [ "$1" = "file-server" ]; then
  build_image "${IMAGE_NAME2}" "file-server"

elif [ "$1" = "frontend" ]; then
  build_image "${IMAGE_NAME3}" "frontend"

else
  echo "Usage: $0 [django|file-server|frontend]"
  exit 1
fi