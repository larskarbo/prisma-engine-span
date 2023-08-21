// Imports
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { Resource } from "@opentelemetry/resources";
import {
	InMemorySpanExporter,
	SimpleSpanProcessor
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { PrismaInstrumentation } from "@prisma/instrumentation";

export const inMemoryExporter = new InMemorySpanExporter();

export const logAndResetSpans = () => {
	inMemoryExporter.getFinishedSpans().forEach((span) => {
		console.log("span.name: ", span.name);
	});

	inMemoryExporter.reset();
};

export const startInstrumentation = () => {
	console.log("Starting instrumentation");
	// Configure the trace provider
	const provider = new NodeTracerProvider({
		resource: new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: "example application",
		}),
	});

	provider.addSpanProcessor(new SimpleSpanProcessor(inMemoryExporter));

	// Register your auto-instrumentors
	registerInstrumentations({
		tracerProvider: provider,
		instrumentations: [new PrismaInstrumentation()],
	});

	// Register the provider globally
	provider.register();
};
