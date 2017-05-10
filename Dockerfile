FROM node:boron

# Copy app source code
COPY app /app
WORKDIR /app

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
