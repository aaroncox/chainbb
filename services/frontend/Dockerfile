FROM node:boron

RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
RUN npm install --global gulp-cli

# Bundle app source
COPY . /src
WORKDIR /src
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
