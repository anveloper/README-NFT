FROM node:16.15.0 as build-stage

WORKDIR /var/jenkins_home/workspace/deployment/frontend

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# FROM nginx:stable-alpine as production-stage
FROM nginx:stable-alpine

COPY --from=build-stage /var/jenkins_home/workspace/deployment/frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

#COPY --from=build-stage /var/jenkins_home/workspace/deployment/frontend/nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /var/jenkins_home/workspace/deployment/frontend/nginx.conf /etc/nginx/conf.d/
COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g","daemon off;"]