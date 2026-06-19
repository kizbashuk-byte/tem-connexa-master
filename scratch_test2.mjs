class NextRequest {
  get headers() { return "I am headers"; }
}
const req = new NextRequest();
const clone = { ...req };
console.log(clone.headers);
