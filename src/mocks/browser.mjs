import { setupWorker } from '../../node_modules/msw/lib/browser/index.mjs';
import { handlers } from "./handlers";

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
