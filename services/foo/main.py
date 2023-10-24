# from flask import Flask, request
# from flask.logging import default_handler
# import requests
# from opentelemetry import trace
# from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
# from opentelemetry.instrumentation.flask import FlaskInstrumentor
# from opentelemetry.instrumentation.requests import RequestsInstrumentor
# from opentelemetry.sdk.trace import TracerProvider
# from opentelemetry.sdk.trace.export import BatchSpanProcessor
# from opentelemetry.sdk.resources import SERVICE_NAME, Resource
# import logging
# import os
# from random import random
# from time import strftime

# AGENT_HOSTNAME = os.getenv("AGENT_HOSTNAME", "localhost")
# AGENT_PORT = int(os.getenv("AGENT_PORT", "4317"))
# BAR_ENDPOINT = os.getenv("BAR_ENDPOINT", "http://localhost:5001/bar")


# class SpanFormatter(logging.Formatter):
#     def format(self, record):
#         trace_id = trace.get_current_span().get_span_context().trace_id
#         if trace_id == 0:
#             record.trace_id = None
#         else:
#             record.trace_id = "{trace:032x}".format(trace=trace_id)
#         return super().format(record)

# resource = Resource(attributes={
#     "service.name": "service-foo"
# })

# trace.set_tracer_provider(
#     TracerProvider(resource=resource)
# )
# otlp_exporter = OTLPSpanExporter(endpoint=f"{AGENT_HOSTNAME}:{AGENT_PORT}", insecure=True)
# trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(otlp_exporter))

# app = Flask(__name__)

# FlaskInstrumentor().instrument_app(app)
# RequestsInstrumentor().instrument()

# log = logging.getLogger("werkzeug")
# log.setLevel(logging.ERROR)
# app.logger.setLevel(logging.INFO)
# default_handler.setFormatter(
#     SpanFormatter(
#         'time="%(asctime)s" service=%(name)s level=%(levelname)s %(message)s trace_id=%(trace_id)s'
#     )
# )


# @app.route("/foo")
# def foo():
#     tracer = trace.get_tracer(__name__)
#     with tracer.start_as_current_span("bar-request"):
#         r = requests.get(BAR_ENDPOINT)
#         if r.status_code != 200:
#             return "Error!", r.status_code

#     return "foo" + r.text


# @app.after_request
# def after_request(response):
#     app.logger.info(
#         'addr="%s" method=%s scheme=%s path="%s" status=%s',
#         request.remote_addr,
#         request.method,
#         request.scheme,
#         request.full_path,
#         response.status_code,
#     )
#     return response




# if __name__ == '__main__':
# 	app.run(host='0.0.0.0', port=8000)

# from flask import Flask
# app = Flask(__name__)

# @app.route('/')
# def hello():
# 	return "Hello World!"

# if __name__ == '__main__':
# 	app.run(host='0.0.0.0', port=8000)
 
from fastapi import FastAPI,Request
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
import requests
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter as OTLPSpanExporterHTTP,
)
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
import logging
import os
from random import random
from time import strftime,time

AGENT_HOSTNAME = os.getenv("AGENT_HOSTNAME", "localhost")
AGENT_PORT = int(os.getenv("AGENT_PORT", "4317"))
BAR_ENDPOINT = os.getenv("BAR_ENDPOINT", "http://localhost:5001/bar")


class SpanFormatter(logging.Formatter):
    def __init__(self, fmt):
        super().__init__()
        
    def format(self, record):
        print("setformatter")
        trace_id = trace.get_current_span().get_span_context().trace_id
        if trace_id == 0:
            record.trace_id = None
        else:
            record.trace_id = "{trace:032x}".format(trace=trace_id)
        return super().format(record)

resource = Resource(attributes={
    "service.name": "service-foo"
})

trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter(endpoint=f"{AGENT_HOSTNAME}:{AGENT_PORT}", insecure=True)
OTEL_HTTP_ENDPOINT = os.environ.get(
    "OTEL_HTTP_ENDPOINT", "http://0.0.0.0:4318/v1/traces"
)
http_otlp_exporter = OTLPSpanExporterHTTP(OTEL_HTTP_ENDPOINT)
trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(otlp_exporter))
trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(http_otlp_exporter))



app = FastAPI()

FastAPIInstrumentor().instrument_app(app,trace)
RequestsInstrumentor().instrument()

# logger = logging.getLogger("werkzeug")
# ch = logging.StreamHandler()
# ch.setLevel(logging.DEBUG)
# ch.setFormatter(SpanFormatter(
#         'time="%(asctime)s" service=%(name)s level=%(levelname)s %(message)s trace_id=%(trace_id)s'
#     ))
# logger.addHandler(ch)
# logger.debug("start ------------------------------------")


# create logger with 'spam_application'
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
fh = logging.FileHandler('spam.log')
fh.setLevel(logging.DEBUG)
# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)

chnew = logging.StreamHandler()
chnew.setLevel(logging.INFO)


# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)
chnew.setFormatter(SpanFormatter('time="%(asctime)s" service=%(name)s level=%(levelname)s %(message)s trace_id=%(trace_id)s'))
# add the handlers to the logger
logger.addHandler(fh)
logger.addHandler(ch)
logger.addHandler(chnew)

logger.info('creating an instance of auxiliary_module.Auxiliary')

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    # start_time = time.time()
    response = await call_next(request)
    # process_time = time.time() - start_time
    # response.headers["X-Process-Time"] = str(process_time)
    # print(request)
    # logger.info(
    #     'test'
    # )
    return response

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/foo")
def foo():
    logger.info("echo test ----------------")
    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span("bar-request"):
        r = requests.get(BAR_ENDPOINT)
        if r.status_code != 200:
            return "Error!", r.status_code

    return "foo" + r.text