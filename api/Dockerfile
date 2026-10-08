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


RUN pnpm --filter api build

EXPOSE 5000

CMD ["pnpm", "--filter", "api", "start:prod"]