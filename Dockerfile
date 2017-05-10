FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Use admin user
RUN useradd -ms /bin/bash/ admin
USER admin

COPY app /usr/src/app

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
