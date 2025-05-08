FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

ARG PORT=5001
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["npm", "run", "dev"]