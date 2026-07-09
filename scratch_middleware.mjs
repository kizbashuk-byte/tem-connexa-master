class Headers {
  constructor(init) { this.map = new Map(init ? Object.entries(init) : []); }
  set(k, v) { this.map.set(k, v); }
  get(k) { return this.map.get(k); }
  [Symbol.iterator]() { return this.map.entries(); }
}
class NextRequest {
  constructor() { this._headers = new Headers({ cookie: "foo=bar" }); }
  get headers() { return this._headers; }
}

const req = new NextRequest();
const init = { request: req };

const headers = new Headers();
var _init_request;
if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
    const keys = [];
    for (const [key, value] of init.request.headers){
        headers.set('x-middleware-request-' + key, value);
        keys.push(key);
    }
    headers.set('x-middleware-override-headers', keys.join(','));
}

console.log(Array.from(headers));
