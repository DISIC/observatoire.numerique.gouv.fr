#### DEPENDENCIES ####

FROM node:alpine AS dependencies

RUN mkdir /app
WORKDIR /app

COPY prisma ./

COPY package.json yarn.lock* package-lock.json* ./

RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install; \
  else npm install; \
  fi


#### BUILDER ####
FROM node:alpine AS builder
ARG MONGODB_ADDON_URI

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma;

RUN npm install ts-node --save-dev

RUN if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else npm run build; \
  fi


#### RUNNER ####
FROM node:alpine AS runner
ARG MONGODB_ADDON_URI
WORKDIR /app


ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c","npx -y prisma db push --skip-generate && node server.js"]
