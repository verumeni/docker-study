# Docker Compose について

- 複数コンテナで構成されるアプリケーションを１つのファイルで管理するため構成ファイル

## 基本構文

```yaml

# service
services:

 # appコンテナ
 app:
  # imageをビルド
  build:
   context: . # Dockerfile配置パス
   dockerfile: Dockerfile # Dockerfileファイル名
  container_name: app
  # port host:docker
  ports:
   - "3000:3000"
  # 環境変数
  environment:
   DB_HOST: db
   DB_PASSWORD: password
  volumes:
   - .:/app # host側をマウント host:container
  # 依存コンテナ redisサービスが起動後にappサービスが起動する,redisサービスが正常に起動しない場合appサービスは起動を中断
  depends_on:
   - redis
  command: ["npm", "start"]

 # redisコンテナ(ストレージ)
 redis:
  image: redis:7-alpine # docker image
  container_name: storage
  ports:
   - "6379:6379"
  volumes:
   - redis_data:/data # redis_dataはdocker管理下
  command: ["redis-server", "--appendonly", "yes"]

# volumes docker管理下
volumes:
 redis_data:

```

## 実施コマンド

```bash
# 起動 --build imageを再ビルド, -d バックグラウンド起動
docker compose up --build -d

# composeに含まれるコンテナだけ表示
docker compose ps

# 停止 + container削除
docker compose down
```
