const obj = {
  get headers() { return "I am headers"; }
};
const clone = { ...obj };
console.log(clone.headers); // undefined!
