FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/safercity-backend
WORKDIR /usr/src/safercity-backend

COPY package.json /usr/src/safercity-backend
COPY app /usr/src/safercity-backend/app

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
