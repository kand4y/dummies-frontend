FROM node:22-alpine

WORKDIR /app

# 依存関係をキャッシュするため package.json を先にコピー
COPY package*.json ./
RUN npm ci

# ソースは docker-compose のボリュームマウントで上書きされます
COPY . .

EXPOSE 5173

# --host でコンテナ外からアクセス可能にする
CMD ["npm", "run", "dev", "--", "--host"]
