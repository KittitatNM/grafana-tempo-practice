# FROM node:16.19 as builder
# ARG BUILD_ID
# LABEL stage=builder
# LABEL build=$BUILD_ID
# USER node

# WORKDIR /home/node

# COPY . /home/node

# RUN npm install
# RUN npm run build

# RUN rm -rf /home/node/node_modules

# # RUN npm install --production

# # ---

# FROM node:16.19-alpine
# ENV NODE_ENV production

# USER root
# WORKDIR /home/node

# COPY --from=builder /home/node/package.json /home/node/
# # COPY --from=builder /home/node/log4js.json /home/node/
# COPY --from=builder /home/node/dist/ /home/node/dist/
# # COPY --from=builder /home/node/security /home/node/security
# COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
# # COPY --from=builder /home/node/client /home/node/client
# # COPY --from=builder /home/node/entryPoint.sh .


# # RUN mkdir logs
# # RUN chmod -R 777 logs
# # RUN chmod -R 777 entryPoint.sh

# # ENTRYPOINT ["./entryPoint.sh"]
# CMD ["node", "dist/main.js"]
# # ---

# -----------------------------------------------------------------------

# ###################
# # BUILD FOR LOCAL DEVELOPMENT
# ###################

# FROM node:16.19.1-alpine As development

# # Create app directory
# WORKDIR /usr/src/app

# # Copy application dependency manifests to the container image.
# # A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# # Copying this first prevents re-running npm install on every code change.
# COPY --chown=node:node package*.json ./

# # Install app dependencies using the `npm ci` command instead of `npm install`
# RUN npm ci

# # Bundle app source
# COPY --chown=node:node . .

# # Use the node user from the image (instead of the root user)
# USER node

# ###################
# # BUILD FOR PRODUCTION
# ###################

# FROM node:16.19.1-alpine As build

# WORKDIR /usr/src/app

# COPY --chown=node:node package*.json ./

# # In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# COPY --chown=node:node . .

# # Run the build command which creates the production bundle
# RUN npm run build

# # Set NODE_ENV environment variable
# ENV NODE_ENV production

# # Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
# RUN npm ci --only=production && npm cache clean --force

# USER node

# ###################
# # PRODUCTION
# ###################

# FROM node:16.19.1-alpine As production

# # Copy the bundled code from the build stage to the production image
# COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
# COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# RUN ls -al
# # Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# -----------------------------------------------------------------------

FROM node:16.19.1-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

CMD [ "npm", "start" ]