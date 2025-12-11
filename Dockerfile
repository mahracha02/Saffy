FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Port standard pour Expo Web (Metro Bundler)
EXPOSE 8081

# Lancement explicite en mode web
CMD ["npx", "expo", "start", "--web"]
