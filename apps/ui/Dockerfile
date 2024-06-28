FROM node:20.10.0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR .
COPY . .

RUN pnpm install --prod --frozen-lockfile

WORKDIR ./apps/ui

RUN pnpm run build

EXPOSE 3001
CMD ["pnpm", "start"]