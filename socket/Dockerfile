FROM node:16.15.0 AS build

WORKDIR /jenkins_home/workspace/deployment/socket/

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

FROM node:16.15.0

RUN mkdir /app

WORKDIR /app

RUN mkdir ./dist

RUN ["npm", "install", "pm2", "-g"]

COPY . .

COPY --from=build /jenkins_home/workspace/deployment/socket/dist ./dist

EXPOSE 5000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]