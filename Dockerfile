# Stage 1 - Build the Angular app
FROM node:alpine3.18 AS builder
WORKDIR /app
COPY client/package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY client/ ./
RUN npm run build
# Stage 2 - Build the Node.js app and run it
FROM node:alpine3.18
WORKDIR /app
COPY server/package*.json ./
RUN npm install -g typescript
RUN npm install
COPY --from=builder /app/dist/client /app/public
COPY server/ ./
RUN tsc --outDir build
EXPOSE 5000
CMD [ "node", "build/index.js" ]