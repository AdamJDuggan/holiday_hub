FROM node:alpine3.18
WORKDIR /app
COPY package*.json ./
RUN npm install -g typescript
RUN npm install
COPY / ./
RUN tsc --outDir build
EXPOSE 5000
CMD [ "node", "build/index.js" ]