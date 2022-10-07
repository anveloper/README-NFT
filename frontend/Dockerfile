FROM node:16.15.0 AS build

WORKDIR /jenkins_home/workspace/deployment/frontend

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir /app

WORKDIR /app

RUN mkdir ./build

COPY --from=build /jenkins_home/workspace/deployment/frontend/build ./build

# COPY --from=build /jenkins_home/workspace/deployment/frontend/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d

# COPY --from=build /jenkins_home/workspace/deployment/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]