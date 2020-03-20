/**
 *
 * @author nghiatc
 * @since Mar 20, 2020
 */

const BigInteger = require("big-integer");


const SSS = {};

// The largest PRIME 256-bit big.Int
// https://primes.utm.edu/lists/2small/200bit.html
// PRIME = 2^n - k = 2^256 - 189
const PRIME = BigInteger("115792089237316195423570985008687907853269984665640564039457584007913129639747", 10);

// Returns a random number from the range (0, PRIME-1) inclusive
SSS.randomNumber = function() {
  return BigInteger.randBetween(BigInteger.one, PRIME);
};

// Return Base64 string from BigInteger 256 bits long
SSS.toBase64 = function(number) {
  let hexdata = number.toString(16);
  let n = 64 - hexdata.length;
  for (let i=0; i<n; i++) {
    hexdata = "0" + hexdata;
  }
  let buf = Buffer.from(hexdata, 'utf8');
  return buf.toString('base64');
};

// Return BigInteger from Base64 string.
SSS.fromBase64 = function(number) {
  let buf = Buffer.from(number, 'base64');
  let hexdata = buf.toString('utf8');
  return BigInteger(hexdata, 16);
};

// Return Hex string from BigInteger 256 bits long
SSS.toHex = function(number) {
  let hexdata = number.toString(16);
  let n = 64 - hexdata.length;
  for (let i=0; i<n; i++) {
    hexdata = "0" + hexdata;
  }
  return hexdata;
};

// Return BigInteger from Hex string.
SSS.fromHex = function(number) {
  return BigInteger(number, 16);
};


exports = module.exports = SSS;