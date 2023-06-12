# Dockerfile(Pipeline)

FROM node:16.20.0-alpine

WORKDIR /home

ENV MORGAN_TYPE prod
ENV API_PORT 8080

COPY build /home/build
COPY node_modules /home/node_modules

EXPOSE 8080

CMD ["node","build/server.js"]
