const { NextRequest } = require('next/server');
const req = new NextRequest('http://localhost/', { headers: { cookie: 'foo=bar' } });
console.log('Before set:', req.headers.get('cookie'));
req.cookies.set('baz', 'qux');
console.log('After set:', req.headers.get('cookie'));
