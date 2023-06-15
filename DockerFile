# 사용할 베이스 이미지
FROM node:18

# 작업 디렉토리 생성 괴정
RUN mkdir -p /app

# 작업 디렉토리 설정
WORKDIR /app

COPY package*.json /app/

# 종속성 설치
RUN npm install

# 파일 복사
COPY . /app/

# 포트 번호 설정
EXPOSE 3000
CMD [ "node", "app.js"]
# commit & push 필수