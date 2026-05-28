// Ensure the Web Crypto global exists on older Node runtimes (Node < 19 does
// not expose `crypto` as a global). @nestjs/typeorm calls crypto.randomUUID()
// at module load, so this must run before AppModule is imported.
import { webcrypto } from 'node:crypto';

if (!(globalThis as { crypto?: unknown }).crypto) {
  (globalThis as { crypto?: unknown }).crypto = webcrypto;
}
