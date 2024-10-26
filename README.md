# ntc-ncrypto
ntc-ncrypto is a module node cryptography.  

## Install

```bash
npm i ntc-ncrypto
```

## 1. An implementation of Shamir's Secret Sharing Algorithm 256-bits in Node

### Usage
**Use encode/decode Base64Url**  
```js
const ncrypto = require('ntc-ncrypto');

var s = "nghiatcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
console.log(s);
console.log(s.length);
// creates a set of shares
var arr = ncrypto.sss.create(3, 6, s, true);
console.log(arr);

// combines shares into secret
var a1 = arr.slice(0, 3);
var s1 = ncrypto.sss.combine(a1, true);
console.log("combines shares 1 length = " + a1.length);
console.log("secret: " + s1);
console.log("secret.length: " + s1.length);

var a2 = arr.slice(3, 6);
var s2 = ncrypto.sss.combine(a2, true);
console.log("combines shares 2 length = " + a2.length);
console.log("secret: " + s2);
console.log("secret.length: " + s2.length);

var a3 = arr.slice(1, 5);
var s3 = ncrypto.sss.combine(a3, true);
console.log("combines shares 3 length = " + a3.length);
console.log("secret: " + s3);
console.log("secret.length: " + s3.length);
```

**Use encode/decode Hex**  
```js
const ncrypto = require('ntc-ncrypto');

var s = "nghiatcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
console.log(s);
console.log(s.length);
// creates a set of shares
var arr = ncrypto.sss.create(3, 6, s, false);
console.log(arr);

// combines shares into secret
var a1 = arr.slice(0, 3);
var s1 = ncrypto.sss.combine(a1, false);
console.log("combines shares 1 length = " + a1.length);
console.log("secret: " + s1);
console.log("secret.length: " + s1.length);

var a2 = arr.slice(3, 6);
var s2 = ncrypto.sss.combine(a2, false);
console.log("combines shares 2 length = " + a2.length);
console.log("secret: " + s2);
console.log("secret.length: " + s2.length);

var a3 = arr.slice(1, 5);
var s3 = ncrypto.sss.combine(a3, false);
console.log("combines shares 3 length = " + a3.length);
console.log("secret: " + s3);
console.log("secret.length: " + s3.length);
```

## License
This code is under the [Apache License v2](https://www.apache.org/licenses/LICENSE-2.0).  
