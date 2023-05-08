# Use latest version of node
FROM node:20-alpine
# Copy files
COPY . /app
# Specify work directory
WORKDIR /app
# Build react
ARG backend_url
ENV REACT_APP_BACKEND_URL=$backend_url
RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]