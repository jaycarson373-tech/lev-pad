FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && mkdir -p /app/.runtime && chown node:node /app/.runtime
COPY clients/program.mjs ./clients/program.mjs
COPY lib ./lib
COPY config ./config
COPY scripts/keeper.mjs scripts/keeper-health.mjs ./scripts/
USER node
CMD ["node", "scripts/keeper.mjs"]
