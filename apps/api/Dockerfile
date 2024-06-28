FROM node:20.10.0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR .
COPY . .

RUN pnpm install --prod --frozen-lockfile
WORKDIR ./apps/api

RUN pnpm run build

EXPOSE 3000
CMD ["node", "--env-file=.env", "build/index.js"]