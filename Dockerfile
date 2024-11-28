# etape 1 image nodejs
FROM node:18 

# etape 2 repertoire de travail
WORKDIR /app

# etape 3
COPY package*.json  pnpm-lock.yaml* ./


# etape 4 install pnmp et les dépendences di projet
RUN npm install -g pnpm && pnpm install

# etape 5 expose le port use par nuxt
EXPOSE 3000

#etape 6 run nuxt
CMD ["pnpm","run","dev"]







