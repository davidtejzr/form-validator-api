FROM node:22.11.0
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ADD startup.sh /bin/startup.sh
RUN chmod +x /bin/startup.sh

ENTRYPOINT ["/bin/startup.sh"]
