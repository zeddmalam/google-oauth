FROM node:10

WORKDIR /home/node/app

ADD index.mjs .
ADD package.json .

RUN npm install

RUN pwd

EXPOSE 3000

CMD ["npm", "start"]