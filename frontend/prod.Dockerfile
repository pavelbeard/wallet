FROM node:lts-alpine3.20 AS base

# downloading deps
FROM base AS deps

RUN apk add --no-cache curl libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
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
   addgroup --system --gid 1001 nextjs && \
   adduser --system --uid 1001 wallet_app;

COPY --from=builder /app ./public


RUN mkdir .next; chown -R wallet_app:nextjs .next

COPY --from=builder /app/replace-env.sh /usr/local/bin/replace-env.sh
RUN chmod +x /usr/local/bin/replace-env.sh

COPY --from=builder --chown=wallet_app:nextjs /app/.next/standalone ./
COPY --from=builder --chown=wallet_app:nextjs /app/.next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

USER wallet_app

ENTRYPOINT [ "replace-env.sh" ]

CMD ["node", "server.js"]