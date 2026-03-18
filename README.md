# Docker 学習リポジトリ

Docker を「なんとなく使える」状態から、「開発環境を自力で設計・改善できる」状態まで引き上げるための学習用リポジトリです。

## 学習ゴール

- 到達目標: `Dockerfile` と `compose.yaml` を自力で設計・改善し、ローカル開発環境を安定運用できる
- 学習方針: 概念20% + 手を動かす80%

## 使用技術スタック

- Node.js
- Express（またはFastify）
- Docker / Docker Compose
- ストレージサーバ: Redis（推奨）

## 学習ロードマップ

### Step 1: コンテナ基礎

- テーマ: image / container / volume / network、主要CLI
- image
  - ハンズオン:
    - `docker pull nginx:alpine` 取得
    - `docker images` 確認
    - `docker rmi nginx:alpine` 削除
- container
  - ハンズオン:
    - `docker run --name {コンテナ名} -d -p {ホストポート}:{コンテナポート} {イメージ名}` 起動(-dはバックグラウンド起動)
    - `docker ps` コンテナ一覧(-aで停止中のコンテナも表示)
    - `docker stop {コンテナ名}` 停止
    - `docker start {コンテナ名}` 起動
- volume
  - Docker管理下のストレージ
  - ハンズオン:
    - `docker volume create {名称}` 作成
    - `docker volume ls` 確認
    - `docker volume rm {名称}` 削除
- network
  - 同一ネットワーク内であればコンテナ同士の通信が可能
  - ハンズオン:
    - `docker network create {名称}` 作成
    - `docker network ls` 確認
    - `docker network rm {名称}` 削除
    - `docker network connect {ネットワーク名} {コンテナ名}` 接続
    - `docker network disconnect {ネットワーク名} {コンテナ名}` 切断
    - `docker network inspect {ネットワーク名}` network管理下のコンテナを確認
- その他ハンズオン:
  - `docker logs {コンテナ名}` ログ確認(オプション複数あり)
  - `docker exec -ti {コンテナ名} bash` コンテナに接続し直接コマンド入力可能
- 検証: コンテナ起動と停止、ログ確認、ポート疎通が説明できる

### Step 2: Dockerfile からコンテナ化
- テーマ: Dockerfileを使用したコンテナ化 `FROM`, `CMD`
- ハンズオン:
  - Dockerfileを作成(step2フォルダ参照)
  - `docker build ./ -t docker-study-step1:local` イメージ化
  - `docker run docker-study-step1:local` 起動(Hello world!が出力)
- 検証: コンテナを起動したが即停止しているのはメインプロセスがechoを実行して終了するため、起動させたままにするにはメインプロセスを終了しないようにする必要あり

### Step 3: Node アプリコンテナ化

- テーマ: `FROM`, `RUN`, `COPY`, `WORKDIR`, `CMD`, `ENTRYPOINT`
- ハンズオン:
  - Node アプリ（`app`）の `Dockerfile` を作成(step3フォルダ参照)
  - `docker build ./ -t docker-study-app:local`
  - `docker run --rm -p 3000:3000 docker-study-app:local` (--rmはコンテナ停止時に自動的に削除されるオプション)
- 検証: `docker build` が通り、コンテナ内の実行コマンドの意図を説明できる

### Step 4: Dockerfile改善

- テーマ: レイヤー最適化、`.dockerignore`、キャッシュ理解
- ハンズオン:
  - .dockerignoreで不要なファイルを除外しイメージを軽量化
  - 変更前後の `docker image ls` を記録
- 検証: 改善前後でサイズ/速度差を数値で示せる(node_modules, Dockerfile分軽量化)

### Step 5: Compose で app + storage 構成を作る

- テーマ: 複数サービス、ボリューム、環境変数
- ハンズオン:
  - `docker compose up --build` (--buildはイメージを再ビルド)
  - `app` と `storage`（Redis）の2サービス起動を確認
  - app から `storage` のホスト名で接続できることを確認
- 検証: 複数サービス構成と依存関係を説明できる

### Step 6: app -> storage データ取得連携

- テーマ: サービス間通信、データ参照API
- ハンズオン:
  - Node app に `GET /items` などのAPIを追加
  - app から Redis の値を取得してレスポンス返却
  - 初期データ投入（起動後に `redis-cli` または seed 処理）
    `docker compose exec redis redis-cli RPUSH items apple banana orange`
- 検証: app API を叩くと storage のデータが返る

### Step 7: 開発向けCompose運用

- テーマ: ホットリロード、ログ確認、再起動運用
- ハンズオン:
  - アプリコード編集時の反映を確認
  - `docker compose logs -f app`
- 検証: 変更反映、ログ追跡、再起動フローを説明できる

### Step 8: デバッグ実践

- テーマ: 起動失敗・疎通失敗・権限問題の切り分け
- ハンズオン:
  - 意図的に誤設定を入れて復旧
  - `docker inspect`, `docker exec`, `docker compose ps`
- 検証: ログから原因特定→修正までを再現できる

### Step 9: セキュリティ/軽量化

- テーマ: 非root、イメージサイズ削減、不要パッケージ整理
- ハンズオン:
  - app コンテナを非root実行
  - Node イメージのタグ比較（`node:slim` など）
- 検証: 安全性と軽量化のトレードオフを説明できる

## 便利コマンド

```bash
docker build -t docker-study-app:local .
docker run --rm -p 3000:3000 docker-study-app:local
docker compose up --build
docker compose down
docker compose logs -f app
```
