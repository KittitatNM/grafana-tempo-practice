FROM python:3.10-alpine
WORKDIR /code
ENV FLASK_APP=bar.py
ENV FLASK_RUN_HOST=0.0.0.0
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install fastapi
RUN pip install "uvicorn[standard]"
EXPOSE 5000
COPY . /code
# CMD ["flask", "run"]

CMD ["/usr/local/bin/python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]

