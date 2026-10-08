FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

# Copy workspace/package manifests first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./

COPY web/package.json ./web/package.json
COPY packages/enums/package.json ./packages/enums/package.json
COPY packages/types/package.json ./packages/types/package.json


# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Accept the API URL during build stage
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]