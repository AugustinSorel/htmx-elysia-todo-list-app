FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY drizzle.config.ts .
COPY drizzle drizzle

RUN bun styles:build

RUN bun db:migrate

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000
