FROM node:23-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate

COPY src ./src
COPY certs ./certs

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start"]