# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.11.1

# The base node image sets a very verbose log level.
ENV MODE production

WORKDIR /usr/src/app

# Copy all local files into the image.
COPY . .

# Build for production.
RUN yarn

# Build for production.
CMD [ "yarn", "start" ]

# Tell Docker about the port we'll run on.
EXPOSE 5000