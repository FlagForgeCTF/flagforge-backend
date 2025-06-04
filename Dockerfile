FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
RUN npm run build

COPY . .


FROM node:lts-alpine

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm","run", "start"]