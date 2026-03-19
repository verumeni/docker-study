# Dockerfileについて

- Docker imageを作成するためのファイル

## 基本構文

```Dockerfile

# 元イメージ
FROM node:22-slim

# container内での作業DIR
WORKDIR /app

# ファイルコピー host container
COPY . .

# コマンド実行 (image build時に実行)
RUN npm ci

# 公開ポート
EXPOSE 80

# コマンド実行 (コンテナ起動時に実行)
CMD ["npm", "start"]

```

## 命令文

- FROM
- COPY
- RUN
- CMD
- EXPOSE
