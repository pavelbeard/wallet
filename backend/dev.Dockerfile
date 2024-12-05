FROM python:3.12.5-alpine3.20 AS builder

WORKDIR /app-build

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip; \
    pip install --no-cache-dir -r requirements.txt

FROM python:3.12.5-alpine3.20 AS main

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

ENV PYTHONUNBUFFERED=1
ENV APP_HOME=/home/wallet_app/app

RUN \
   if [ ! -d $APP_HOME/staticfiles ]; then mkdir -p $APP_HOME/staticfiles; \
   else echo ""; \
   fi

WORKDIR $APP_HOME

COPY . $APP_HOME

EXPOSE 8080