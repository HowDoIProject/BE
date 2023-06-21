# 사용할 베이스 이미지
FROM node:18
# RUN npm install -g yarn
# 작업 디렉토리 생성 괴정

# 작업 디렉토리 설정
WORKDIR /app

COPY package*.json ./
COPY ./ ./

# 종속성 설치
RUN yarn install

# 파일 복사

# 포트 번호 설정
EXPOSE 3001
CMD [ "node", "app.js"]
# commit & push 필수
