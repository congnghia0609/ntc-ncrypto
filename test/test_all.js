/**
 *
 * @author nghiatc
 * @since Mar 20, 2020
 */
// Command run test: 
// cd ~/ntc/ntc-ncrypto
// node ./test/test_all.js

const sss = require('../src/sss');
var BigInteger = require("big-integer");


// // Dev1: randomNumber
// for (let i=0; i < 100; i++) {
//   var rd = sss.randomNumber();
//   console.log('rd: ' + rd.toString(10));
// }


// // Dev1: encode/decode
// var number = BigInteger("67356225285819719212258382314594931188352598651646313425411610888829358649431", 10);
// console.log(number.toString(10));
// // encode
// var b64data = sss.toBase64(number);
// console.log(b64data.length); // 88
// console.log(b64data);
// // OTRlYTQ1YzMyYzI5MDllNTQwNzBhZDNmMmNlMjg2Zjk4YjU2ZWY1YzcyOGY1NmQ3ZDNhMDljNWJiNTU5MzA1Nw==
// var hexdata = sss.toHex(number);
// console.log(hexdata.length); // 64
// console.log(hexdata);
// // 94ea45c32c2909e54070ad3f2ce286f98b56ef5c728f56d7d3a09c5bb5593057
// // decode
// var numb64decode = sss.fromBase64(b64data);
// console.log(numb64decode.toString(10));
// var numhexdecode = sss.fromHex(hexdata);
// console.log(numhexdecode.toString(10));


// // Dev2: split & merge
// let s = "nghiatcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// console.log(s);
// console.log(s.length);
// let arr = sss.splitSecretToBigInt(s);
// // console.log(arr);
// let value = BigInteger("49937119214509114343548691117920141602615245118674498473442528546336026425464", 10);
// console.log(sss.inNumbers(arr, value));
// let rs = sss.mergeBigIntToString(arr);
// console.log(rs);
// console.log(rs.length);


// Test1:
let s = "nghiatcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
console.log(s);
console.log(s.length);
// creates a set of shares
let arr = sss.create(3, 6, s);
console.log(arr);

