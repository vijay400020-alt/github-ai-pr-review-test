import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as dns } from 'node:dns';
import { lookupHandler } from '../src/lookup.mjs';

function responseRecorder() {
  return { status: null, body: '', writeHead(status) { this.status = status; }, end(body) { this.body = body; } };
}

test('fixed handler rejects missing, unapproved and shell-like input without DNS calls', async t => {
  const resolver = t.mock.method(dns, 'lookup', async () => { throw new Error('Must not resolve'); });
  for (const url of ['/lookup', '/lookup?hostname=localhost', '/lookup?hostname=example.com%3Binvalid']) {
    const res = responseRecorder();
    await lookupHandler({ url }, res);
    assert.equal(res.status, 400);
  }
  assert.equal(resolver.mock.callCount(), 0);
});

test('fixed handler uses DNS API for an approved host', async t => {
  const resolver = t.mock.method(dns, 'lookup', async hostname => {
    assert.equal(hostname, 'example.com');
    return { address: '192.0.2.1', family: 4 };
  });
  const res = responseRecorder();
  await lookupHandler({ url: '/lookup?hostname=example.com' }, res);
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(res.body), { address: '192.0.2.1' });
  assert.equal(resolver.mock.callCount(), 1);
});

test('fixed handler returns a generic DNS error without exposing internal details', async t => {
  t.mock.method(dns, 'lookup', async () => { throw new Error('Internal detail'); });
  const res = responseRecorder();
  await lookupHandler({ url: '/lookup?hostname=example.org' }, res);
  assert.equal(res.status, 502);
  assert.equal(res.body, 'Lookup failed');
});
