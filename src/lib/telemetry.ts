import { trace, SpanStatusCode, Span, context } from '@opentelemetry/api';
import type { TraceAttributes } from '@/types/observability';

const tracer = trace.getTracer('aegis-skill-registry', '1.0.0');

export function createSkillSpan(
  name: string,
  attributes: Partial<TraceAttributes>,
  fn: (span: Span) => Promise<void>
): Promise<void> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined) {
          span.setAttribute(key, value as string | number | boolean);
        }
      });
      await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

export function injectTraceContext(): Record<string, string> {
  const carrier: Record<string, string> = {};
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    const spanContext = activeSpan.spanContext();
    carrier['traceparent'] = `00-${spanContext.traceId}-${spanContext.spanId}-01`;
  }
  return carrier;
}

export function extractTraceInfo(): { traceId: string; spanId: string } | null {
  const activeSpan = trace.getActiveSpan();
  if (!activeSpan) return null;
  const ctx = activeSpan.spanContext();
  return {
    traceId: ctx.traceId,
    spanId: ctx.spanId,
  };
}

export function recordSkillEvent(
  eventName: string,
  attributes: Record<string, string | number | boolean>
): void {
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    activeSpan.addEvent(eventName, attributes);
  }
}
