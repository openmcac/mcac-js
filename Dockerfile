FROM node:4.2

RUN mkdir /app
WORKDIR /app

ADD package.json /app/package.json
RUN npm -q install

ADD . /app
RUN npm -q install -g phantomjs bower ember-cli; bower --allow-root install

EXPOSE 4200
EXPOSE 49152
