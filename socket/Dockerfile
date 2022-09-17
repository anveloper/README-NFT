FROM node:16.15.0 AS build

WORKDIR /jenkins_home/workspace/deployment/socket/

COPY package*.json ./

RUN ["npm", "install"]

RUN ["npm", "install", "pm2", "-g"]

COPY . .

RUN ["npm", "run", "build"]

FROM node:16.15.0

RUN mkdir /app

WORKDIR /app

RUN mkdir ./dist

# RUN ["npm", "install", "pm2", "-g"]

# # 얘 뭐지?
# RUN npm ci --only=production

# # 얘도 뭐지?
# ENV NODE_ENV production
COPY . .

COPY --from=build /jenkins_home/workspace/deployment/socket/dist ./dist

EXPOSE 5000

# CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
# CMD ["pm2-runtime", "start", "npm", "--", "run", "server.js"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
# CMD ["pm2", "start", "server.js"]