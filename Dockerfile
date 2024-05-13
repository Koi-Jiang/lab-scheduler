FROM node:lts-alpine as builder

WORKDIR /app
COPY . /app

RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build

FROM node:lts-alpine

WORKDIR /app
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

RUN npm i -g pnpm
RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start"]