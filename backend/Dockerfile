FROM node:18

WORKDIR /app

COPY package*.json ./
COPY .npmrc .npmrc

# Increase npm timeout
RUN npm config set fetch-retry-maxtimeout 600000

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
