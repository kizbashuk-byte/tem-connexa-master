const http = require('http');
const crypto = require('crypto');

class MinimalWebSocket {
  constructor(url) {
    this.url = new URL(url);
    this.callbacks = {};
    this.msgId = 1;
    this.eventListeners = {};
  }

  connect() {
    return new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64');
      const req = http.request({
        port: this.url.port,
        host: '127.0.0.1',
        path: this.url.pathname,
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Key': key,
          'Sec-WebSocket-Version': 13
        }
      });

      req.on('upgrade', (res, socket, head) => {
        this.socket = socket;
        socket.on('data', this._onData.bind(this));
        resolve();
      });

      req.on('error', reject);
      req.end();
    });
  }

  _onData(data) {
    let offset = 0;
    while (offset < data.length) {
      const byte1 = data[offset++];
      const byte2 = data[offset++];
      let payloadLength = byte2 & 0x7F;
      
      if (payloadLength === 126) {
        payloadLength = data.readUInt16BE(offset);
        offset += 2;
      } else if (payloadLength === 127) {
        payloadLength = Number(data.readBigUInt64BE(offset));
        offset += 8;
      }
      
      const payload = data.slice(offset, offset + payloadLength);
      offset += payloadLength;

      try {
        const msg = JSON.parse(payload.toString());
        if (msg.id && this.callbacks[msg.id]) {
          this.callbacks[msg.id](msg.result);
          delete this.callbacks[msg.id];
        } else if (msg.method && this.eventListeners[msg.method]) {
          this.eventListeners[msg.method].forEach(cb => cb(msg.params));
        }
      } catch(e) {}
    }
  }

  send(method, params = {}) {
    return new Promise((resolve) => {
      const id = this.msgId++;
      this.callbacks[id] = resolve;
      const msg = Buffer.from(JSON.stringify({ id, method, params }));
      
      const mask = crypto.randomBytes(4);
      let headerLen = 2;
      if (msg.length >= 126 && msg.length <= 65535) headerLen += 2;
      else if (msg.length > 65535) headerLen += 8;
      
      const frame = Buffer.alloc(headerLen + 4 + msg.length);
      frame[0] = 0x81;
      
      let offset = 1;
      if (msg.length < 126) {
        frame[offset++] = msg.length | 0x80;
      } else if (msg.length <= 65535) {
        frame[offset++] = 126 | 0x80;
        frame.writeUInt16BE(msg.length, offset);
        offset += 2;
      } else {
        frame[offset++] = 127 | 0x80;
        frame.writeBigUInt64BE(BigInt(msg.length), offset);
        offset += 8;
      }
      
      mask.copy(frame, offset);
      offset += 4;
      
      for (let i = 0; i < msg.length; i++) {
        frame[offset + i] = msg[i] ^ mask[i % 4];
      }
      
      this.socket.write(frame);
    });
  }

  on(method, cb) {
    if (!this.eventListeners[method]) this.eventListeners[method] = [];
    this.eventListeners[method].push(cb);
  }
  
  close() {
    this.socket.destroy();
  }
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  let targets = null;
  for (let i = 0; i < 10; i++) {
    try {
      targets = await fetchJSON('http://127.0.0.1:9222/json');
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!targets) {
    console.error("Failed to connect to Chrome");
    process.exit(1);
  }

  const page = targets.find(t => t.type === 'page');
  const ws = new MinimalWebSocket(page.webSocketDebuggerUrl);
  await ws.connect();
  console.log("Connected to Chrome!");

  const consoleLogs = [];
  const exceptions = [];
  const network = { requests: {}, failed: [] };

  ws.on('Runtime.consoleAPICalled', params => {
    const type = params.type;
    const msg = params.args.map(a => a.value || a.description).join(' ');
    consoleLogs.push(`[Console ${type}] ${msg}`);
  });

  ws.on('Runtime.exceptionThrown', params => {
    exceptions.push(`[Exception] ${params.exceptionDetails.exception?.description || params.exceptionDetails.text}`);
  });

  ws.on('Network.requestWillBeSent', params => {
    network.requests[params.requestId] = { url: params.request.url };
  });

  ws.on('Network.responseReceived', params => {
    if (network.requests[params.requestId]) {
      network.requests[params.requestId].status = params.response.status;
      if (params.response.status >= 400) {
        network.failed.push(`[HTTP ${params.response.status}] ${params.response.url}`);
      }
    }
  });

  ws.on('Network.loadingFailed', params => {
    if (network.requests[params.requestId]) {
      network.failed.push(`[Failed Request] ${network.requests[params.requestId].url} - ${params.errorText}`);
    }
  });

  await ws.send('Runtime.enable');
  await ws.send('Network.enable');
  await ws.send('Page.enable');

  console.log("Navigating to http://localhost:3000/login...");
  await ws.send('Page.navigate', { url: 'http://localhost:3000/login' });

  setTimeout(async () => {
    console.log("\n--- BROWSER EVIDENCE ---");
    
    console.log("\n1. Console & Exceptions:");
    if (consoleLogs.length === 0) console.log("No console logs or hydration warnings.");
    else consoleLogs.forEach(l => console.log(l));
    
    if (exceptions.length > 0) exceptions.forEach(e => console.log(e));
    
    console.log("\n2. Network & Failed Chunks:");
    if (network.failed.length === 0) console.log("No failed requests or bad responses.");
    else network.failed.forEach(e => console.log(e));
    
    const doc = await ws.send('Runtime.evaluate', { expression: 'document.body.innerText' });
    console.log("\n3. Current Rendered Text:");
    console.log(doc.result.value.substring(0, 300).replace(/\n/g, ' '));
    
    ws.close();
    process.exit(0);
  }, 5000);
}

run();
