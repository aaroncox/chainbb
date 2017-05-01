FROM python:3.6.1-slim

RUN apt-get update && apt-get install -y make gcc libssl-dev

RUN pip3 install steem pymongo

WORKDIR /src

CMD ["python", "/src/main.py"]
EXPOSE 5000
