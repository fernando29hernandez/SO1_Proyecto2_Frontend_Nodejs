FROM node:10-alpine

# Create app directory
RUN mkdir /app
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY . .
RUN npm install
# If you are building your code for production
EXPOSE 3000
CMD [ "npm","start"]
