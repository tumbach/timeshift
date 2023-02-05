# Define Alpine repo and version
ARG ALPINE_REPO=https://mirror.yandex.ru/mirrors/alpine/ \
    ALPINE_VERSION=3.17 \
    NODE_ENV=production

# Download pnpm ( https://pnpm.io )
FROM alpine:${ALPINE_VERSION} as preliminary
WORKDIR /app
RUN wget -O /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" \
 && chmod +x /bin/pnpm

FROM alpine:${ALPINE_VERSION} as production
WORKDIR /app
ARG ALPINE_REPO \
    ALPINE_VERSION \
    NODE_ENV
ENV NODE_ENV=$NODE_ENV \
    PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME

RUN echo "${ALPINE_REPO}v${ALPINE_VERSION}/main" > /etc/apk/repositories \
 && echo "${ALPINE_REPO}v${ALPINE_VERSION}/community" >> /etc/apk/repositories \
 && apk add --no-cache \
    g++ \
    libshout \
    make \
    nodejs \
    python3 \
 && ln -s /usr/lib/libshout.so.3 /usr/lib/libshout.so
COPY --from=preliminary /bin/pnpm /bin/pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm add -g node-gyp \
 && pnpm i
COPY *.js ./
CMD ["node", "index.js"]
