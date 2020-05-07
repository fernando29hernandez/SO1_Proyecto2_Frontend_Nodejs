FROM node:10-alpine

# Create app directory
RUN mkdir /app
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./
RUN npm install
RUN npm install -g nodemon
# If you are building your code for production
EXPOSE 3000
CMD [ "nodemon","start"]
