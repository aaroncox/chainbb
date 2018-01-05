FROM python:3.6.2-slim

RUN pip3 install pymongo apscheduler

COPY . /src

CMD ["python", "/src/main.py"]
