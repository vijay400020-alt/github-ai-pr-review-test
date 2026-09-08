import { promises as dns } from 'node:dns';

const ALLOWED_HOSTNAMES = new Set(['example.com', 'example.org']);

// Dummy HTTP handler; this module does not start a server.
export async function lookupHandler(req, res) {
  let hostname;
  try {
    hostname = new URL(req.url, 'http://localhost').searchParams.get('hostname');
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid URL');
    return;
  }
  if (!ALLOWED_HOSTNAMES.has(hostname)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Only example.com and example.org are allowed');
    return;
  }

  try {
    const result = await dns.lookup(hostname);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ address: result.address }));
  } catch {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Lookup failed');
  }
}
