FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install tsc
RUN npm run build

COPY . .


FROM node:lts-alpine

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm","run", "start"]