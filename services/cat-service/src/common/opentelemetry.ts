import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  BasicTracerProvider,
} from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
// import * as apm from 'elastic-apm-node';
// const opentelemetry = require("@opentelemetry/sdk-node");

// Set an internal logger for open telemetry to report any issues to your console/stdout
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

export const initTelemetry = (config: {
  appName: string;
  telemetryUrl: string;
}): void => {
  // create an exporter to an open telemetry exporter. We create this collector instance locally using docker compose.
  const exporter = new OTLPTraceExporter({
    url: config.telemetryUrl, // e.g. "http://otel-collector:4318/v1/traces",
  });

  // We add some common meta data to every trace. The service name is important.
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.appName,
      application: config.appName,
    }),
  );

  // We use the node trace provider provided by open telemetry
  // const provider = new NodeTracerProvider({ resource });
  const provider = new BasicTracerProvider({ resource });

  // The batch span provider is more efficient than the basic provider. This will batch sends to
  // the exporter you have configured
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  // provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  // provider.addSpanProcessor(new BatchSpanProcessor(new ZipkinExporter({url:'http://localhost:9411/api/v2/spans'})));

  // Initialize the propagator
  provider.register({
    // propagator: new W3CTraceContextPropagator(),
  });
  // const sdk = new opentelemetry.NodeSDK({
  //     traceExporter: exporter,
  //     instrumentations: [getNodeAutoInstrumentations()],
  // });

  // sdk
  //     .start()
  //     .then(() => {
  //         console.log("Tracing initialized");
  //     })
  //     .catch((error) => console.log("Error initializing tracing", error));

  // process.on("SIGTERM", () => {
  //     sdk
  //         .shutdown()
  //         .then(() => console.log("Tracing terminated"))
  //         .catch((error) => console.log("Error terminating tracing", error))
  //         .finally(() => process.exit(0));
  // });

  // Registering instrumentations / plugins
  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations(),
  });
};
