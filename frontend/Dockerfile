# Nginx가 제공을 해줄 Build 파일들을 제공하는 단계
FROM node:alpine as builder 
WORKDIR /app
    # package.json을 ./ 폴더로 복사
COPY ./package.json ./
# COPY ./yarn.lock ./

RUN npm install --save --legacy-peer-deps
COPY ./ ./
RUN npm run build

# Nginx를 가동하고 윗 단계에서 생성된 빌드 파일들을 제공하여 준다. 
FROM nginx
EXPOSE 3000
# 그리고 default.conf 에서 해준 설정을 nginx 컨테이너 안에 있는 설정이 되게 복사 해준다. 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# 위에서 생성된 빌드파일을 nginx 컨테이너 안에 있는 root html 위치로 복사하여 준다.
COPY --from=builder /app/build /usr/share/nginx/html





