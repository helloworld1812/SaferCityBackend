FROM node:boron

# Use admin user
RUN useradd -ms /bin/bash/ admin
USER admin

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY app /usr/src/app

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
