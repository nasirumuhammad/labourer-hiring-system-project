FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

# Copy workspace/package manifests first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY api/package.json ./api/package.json
COPY packages/enums/package.json ./packages/enums/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN pnpm install --frozen-lockfile


COPY . .


# Shared workspace packages export from ./dist, which is not in the image
# (.dockerignore) - build them first. enums must come before types.
RUN pnpm --filter @labour-hiring/enums build && pnpm --filter @labour-hiring/types build

RUN pnpm --filter api build

EXPOSE 5000

# Seed is idempotent (skips if the admin/jobs already exist). A failed seed is
# logged by seed.ts but must not stop the API from starting.
CMD ["sh", "-c", "pnpm --filter api seed:prod; pnpm --filter api start:prod"]