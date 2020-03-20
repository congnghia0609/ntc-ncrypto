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

// Returns a new array of secret shares (encoding x,y pairs as Base64 or Hex strings)
// created by Shamir's Secret Sharing Algorithm requiring a minimum number of
// share to recreate, of length shares, from the input secret raw as a string
SSS.create = function(minimum, shares, secret) {
  let rs = [];

  // Verify minimum isn't greater than shares; there is no way to recreate
  // the original polynomial in our current setup, therefore it doesn't make
  // sense to generate fewer shares than are needed to reconstruct the secret.
  if (minimum > shares) {
    throw new Error("cannot require more shares then existing");
  }

  // Convert the secret to its respective 256-bit BigInteger representation
  let secrets = this.splitSecretToBigInt(secret);

  // List of currently used numbers in the polynomial
  let numbers = [];
  numbers.push(BigInteger.zero);

  // Create the polynomial of degree (minimum - 1); that is, the highest
  // order term is (minimum-1), though as there is a constant term with
  // order 0, there are (minimum) number of coefficients.
  // 
  // However, the polynomial object is a 2d array, because we are constructing
  // a different polynomial for each part of the secret
  // 
  // polynomial[parts][minimum]
  let polynomial = new Array(secrets.length);
  for(let i=0; i<secrets.length; i++) {
    polynomial[i] = new Array(minimum);
    polynomial[i][0] = secrets[i];
    for(let j=1; j<minimum; j++) {
      // Each coefficient should be unique
      let number = this.randomNumber();
      while(this.inNumbers(numbers, number)) {
        number = this.randomNumber();
      }
      numbers.push(number);

      polynomial[i][j] = number;
    }
  }
  // console.log(polynomial);

  // Create the points object; this holds the (x, y) points of each share.
  // Again, because secrets is an array, each share could have multiple parts
  // over which we are computing Shamir's Algorithm. The last dimension is
  // always two, as it is storing an x, y pair of points.
  // 
  // points[shares][parts][2]
  let points = new Array(shares);

  // For every share...
  for(let i=0; i<shares; i++) {
    points[i] = new Array(secrets.length);
    let s = "";
    // and every part of the secret...
    for(let j=0; j<secrets.length; j++) {
      points[i][j] = new Array(2);
      // generate a new x-coordinate
      let number = this.randomNumber();
      while(this.inNumbers(numbers, number)) {
        number = this.randomNumber();
      }
      numbers.push(number);

      // and evaluate the polynomial at that point
      points[i][j][0] = number;
      points[i][j][1] = this.evaluatePolynomial(polynomial, j, number);

      // encode
      s += this.toHex(points[i][j][0]);
      s += this.toHex(points[i][j][1]);
    }
    rs.push(s);
  }

  return rs;
};

// Takes a string array of shares encoded in Base64 or Hex created via Shamir's Algorithm
    // Note: the polynomial will converge if the specified minimum number of shares
    //       or more are passed to this function. Passing thus does not affect it
    //       Passing fewer however, simply means that the returned secret is wrong.
SSS.combine = function(shares) {

};


exports = module.exports = SSS;
