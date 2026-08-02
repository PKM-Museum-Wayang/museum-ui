FROM golang:1.23 AS build

LABEL maintaner="Nicolaus Reva Sagraha <nicolaussagraha14@gmail.com>"

WORKDIR /app

ARG API_URL=http://localhost:3000

COPY . ./

RUN npm install
RUN npm install -g vite

RUN npm run build
