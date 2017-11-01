FROM python:3.6.2-slim

RUN apt-get update && apt-get install -y make gcc libssl-dev

ADD ./requirements.txt /
RUN pip3 install -r requirements.txt

WORKDIR /src

CMD ["python", "/src/main.py"]
