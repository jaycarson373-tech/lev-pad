FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY services/signer/package.json services/signer/package-lock.json ./services/signer/
RUN npm --prefix services/signer ci --omit=dev --ignore-scripts && mkdir -p /app/.runtime && chown node:node /app/.runtime
COPY clients/program.mjs ./clients/program.mjs
COPY lib ./lib
COPY config ./config
COPY services/signer/index.mjs ./services/signer/index.mjs
COPY scripts/signer-health.mjs ./scripts/signer-health.mjs
COPY scripts/check-env.mjs ./scripts/check-env.mjs
USER node
CMD ["node", "services/signer/index.mjs"]
