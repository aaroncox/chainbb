FROM python:3.6.2-slim

RUN apt-get update && \
    apt-get install -y git make gcc libssl-dev libgmp-dev python-dev libxml2-dev libxslt1-dev zlib1g-dev

ADD ./requirements.txt /
RUN pip3 install -r requirements.txt

WORKDIR /src/

CMD ["python", "/src/main.py"]
EXPOSE 5000
