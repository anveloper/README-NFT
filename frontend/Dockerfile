# FROM node:16.15.0 as builder
FROM node:16.15.0 AS build

WORKDIR /jenkins_home/workspace/deployment/frontend

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

# FROM nginx:stable-alpine as production-stage
FROM nginx:alpine

## 추가 ##
RUN mkdir /app

WORKDIR /app

RUN mkdir ./build

ADD /jenkins_home/workspace/deployment/frontend/build ./build

###
RUN rm /etc/nginx/conf.d/default.conf

# COPY --from=build /jenkins_home/workspace/deployment/frontend/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d

# COPY --from=build /jenkins_home/workspace/deployment/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]