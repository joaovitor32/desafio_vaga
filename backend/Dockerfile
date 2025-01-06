# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Copy app source code
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Command to run the app
CMD ["yarn", "start:dev"]
