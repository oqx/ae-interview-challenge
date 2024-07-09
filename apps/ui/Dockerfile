FROM node:22.3.0 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter=ui build
RUN pnpm deploy --filter=ui --prod /prod/ui

FROM base AS ui
COPY --from=build /prod/ui /prod/ui
WORKDIR /prod/ui


EXPOSE 3001
CMD ["pnpm", "start"]