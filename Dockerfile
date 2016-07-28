FROM node:4.2
RUN mkdir -p /app
WORKDIR /app

ADD package.json ./package.json
RUN npm -q install
ADD . /app
RUN npm -q install -g phantomjs bower ember-cli; bower --allow-root install
