FROM node:14

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn global add expo-cli

RUN expo build:web

CMD ["yarn", "start"]

