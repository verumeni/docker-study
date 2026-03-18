# 元となるイメージ
FROM node:22-slim

# コンテナ内での作業DIR
WORKDIR /app

COPY package*.json ./

# コマンド実行(build時に実行)
RUN npm ci

COPY . .

# コマンド実行(run時に実行)
CMD ["npm", "start"]