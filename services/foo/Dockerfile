FROM python:3.10-alpine
WORKDIR /code
ENV FLASK_APP=foo.py
ENV FLASK_RUN_HOST=0.0.0.0
COPY requirements.txt requirements.txt
COPY requirements.txt /code
RUN pip install -r requirements.txt
RUN pip install fastapi
RUN pip install "uvicorn[standard]"
EXPOSE 8000
COPY . /code

# ENTRYPOINT ["python3"]
# CMD ["uvicorn", "app:app"]

CMD ["/usr/local/bin/python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["/usr/local/bin/python", "-m", "flask", "run"]
# ENTRYPOINT ["python3"]
# CMD ["foo.py"]
# CMD ["flask", "run"]
# CMD ["python","-m","flask","--app",'foo','run']
# CMD [ "python", "./foo.py" ]
# CMD [ "python","-m","flask","--app", "./foo.py", "run" ]
