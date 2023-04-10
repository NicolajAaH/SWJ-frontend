# Base image
FROM node:latest AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn-lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the app
RUN yarn run build

# Use nginx as base image
FROM nginx:latest

# Copy the built app to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config file to container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy self-signed SSL certificate and key
COPY swj.crt /etc/ssl/certs/certificate.crt
COPY swj.key /etc/ssl/private/certificate.key

# Expose ports
EXPOSE 80
EXPOSE 443

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
