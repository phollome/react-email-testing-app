FROM node:24-alpine AS dev-dependencies
WORKDIR /app-dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS prod-dependencies
WORKDIR /app-dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS build

WORKDIR /app-build
    
COPY --from=dev-dependencies /app-dependencies/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=prod-dependencies /app-dependencies/node_modules ./node_modules
COPY --from=build /app-build/build ./build

COPY package.json ./

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]
