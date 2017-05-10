FROM node:boron

# Use admin user
RUN useradd -ms /bin/bash/ admin
USER admin

# Copy app source code
COPY app /app
WORKDIR /app

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
