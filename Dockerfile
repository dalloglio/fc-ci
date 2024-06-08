FROM node:18-alpine AS builder

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

RUN npm run build

RUN npm prune --production

FROM node:18-alpine

WORKDIR /home/node/app

COPY --chown=node --from=builder /home/node/app/dist ./dist
COPY --chown=node --from=builder /home/node/app/node_modules ./node_modules

USER node

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
