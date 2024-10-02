FROM node:20.12.2

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm-dev \
    libpango-1.0-0 \
    libasound2 \
    libxtst6 \
    libcurl4 \
    libxss1 \
    libgconf-2-4 \
    libxi6 \
    libgdk-pixbuf2.0-0 \
    libxkbcommon0 \
    libxrender1 \
    libXfixes3 \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3005

CMD ["node", "index.js"]
