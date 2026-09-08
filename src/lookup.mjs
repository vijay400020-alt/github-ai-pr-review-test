import { exec } from 'node:child_process';

// Dummy HTTP handler; this module does not start a server.
export function lookupHandler(req, res) {
  const hostname = new URL(req.url, 'http://localhost').searchParams.get('hostname');
  if (!hostname) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('hostname is required');
    return;
  }

  exec(`nslookup ${hostname}`, { timeout: 3000 }, (error, stdout) => {
    res.writeHead(error ? 500 : 200, { 'Content-Type': 'text/plain' });
    res.end(error ? 'Lookup failed' : stdout);
  });
}
