FROM node:lts-alpine3.20 AS base

# downloading deps
FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci; \
   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
   else echo "Lockfile not found." && exit 1; \
   fi

# building project
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
   if [ -f yarn.lock ]; then yarn build; \
   elif [ -f package-lock.json ]; then npm run build; \
   elif [ -f pnpm-lock.yaml ]; then pnpm build; \
   else npm run build; \
   fi


# starting project
FROM base AS runner

WORKDIR /app

RUN \
   addgroup --system --gid 1001 nextjs; \
   adduser --system --uid 1001 cartera;

COPY --from=builder /app/public ./public

RUN mkdir .next; chown cartera:nextjs .nextjs


COPY --from=builder --chown=cartera:nextjs /app/.next/standalone ./
COPY --from=builder --chown=cartera:nextjs /app/.next/static ./.next/static

EXPOSE 3000
USER cartera
CMD ["node", "server.js"]