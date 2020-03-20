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

// Compute the polynomial value using Horner's method.
// https://en.wikipedia.org/wiki/Horner%27s_method
// y = a + bx + cx^2 + dx^3 = ((dx + c)x + b)x + a
SSS.evaluatePolynomial = function(polynomial, part, value) {
  let last = polynomial[part].length - 1;
  let result = polynomial[part][last];
  for(let i=last-1; i>=0; --i) {
    result = result.multiply(value).add(polynomial[part][i]).mod(PRIME);
  }
  return result;
};

// Converts a byte array into an a 256-bit BigInteger, array based upon size of
// the input byte; all values are right-padded to length 256 bit, even if the most
// significant bit is zero.
SSS.splitSecretToBigInt = function(secret) {
  let result = [];
  let hexData = Buffer.from(secret, 'utf8').toString('hex');
  let count = Math.ceil(hexData.length / 64.0);
  for(let i=0; i<count; i++) {
    if((i+1)*64 < hexData.length) {
      let bi = BigInteger(hexData.substring(i*64, (i+1)*64), 16);
      result.push(bi);
    } else {
      let last = hexData.substring(i*64, hexData.length);
      let n = 64 - last.length;
      for(let j=0; j<n; j++) {
        last += "0";
      }
      let bi = BigInteger(last, 16);
      result.push(bi);
    }
  }
  return result;
};

SSS.trimRight = function(s) {
  let i = s.length - 1;
  while(i >= 0 && s[i] === '0') {
    --i;
  }
  return s.substring(0, i + 1);
};

// Converts an array of BigInteger to the original byte array, removing any least significant nulls
SSS.mergeBigIntToString = function(secrets) {
  let result = "";
  let hexData = "";
  for(let i=0; i<secrets.length; i++) {
    let tmp = secrets[i].toString(16);
    let n = 64 - tmp.length;
    for(let j=0; j<n; j++) {
      tmp = "0" + tmp;
    }
    hexData = hexData + tmp;
  }
  hexData = this.trimRight(hexData);
  result = Buffer.from(hexData, 'hex').toString('utf8');
  return result;
};

// inNumbers(array, value) returns boolean whether or not value is in array
SSS.inNumbers = function(numbers, value) {
  for(let i=0; i<numbers.length; i++) {
    if(numbers[i].compareTo(value) == 0) {
      return true;
    }
  }
  return false;
};


exports = module.exports = SSS;
