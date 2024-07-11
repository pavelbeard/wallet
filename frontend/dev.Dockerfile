FROM node:18-alpine as base

# install only important dependencies
FROM base as deps
RUN apk add --no-cache lib6-compat

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* /
