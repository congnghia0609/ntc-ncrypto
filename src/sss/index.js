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

// Return Uint8Array binary representation of hex string
SSS.hexToBuf = function(hex) {
  if (hex.length % 2) {
    hex = `0${hex}`;
  }

  const len = hex.length / 2;
  const u8 = new Uint8Array(len);

  let j = 0;
  for (let i=0; i<len; i++) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    j += 2;
  }

  return u8;
}

// # Return hex string representation of Uint8Array binary
SSS.bufToHex = function(buf) {
  var hex = "";
  const len = buf.length;
  for (let i=0; i<len; i++) {
    hex += buf[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Return Base64Url string from BigInteger 256 bits long
SSS.toBase64Url = function(number) {
  let hexdata = number.toString(16);
  let n = 64 - hexdata.length;
  for (let i=0; i<n; i++) {
    hexdata = "0" + hexdata;
  }
  let buf = Buffer.from(this.hexToBuf(hexdata), 'utf8');
  return buf.toString('base64').replace(/\+/g, "-").replace(/\//g, "_");
};

// Return BigInteger from Base64Url string.
SSS.fromBase64Url = function(number) {
  let buf = Buffer.from(number, 'base64');
  let hexdata = this.bufToHex(buf);
  return BigInteger(hexdata, 16);
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
  var hexdata = number.toString(16);
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
  var result = polynomial[part][last];
  for(let i=last-1; i>=0; --i) {
    result = result.multiply(value).add(polynomial[part][i]).mod(PRIME);
  }
  return result;
};

// Converts a byte array into an a 256-bit BigInteger, array based upon size of
// the input byte; all values are right-padded to length 256 bit, even if the most
// significant bit is zero.
SSS.splitSecretToBigInt = function(secret) {
  var result = [];
  let hexData = Buffer.from(secret, 'utf8').toString('hex');
  let count = Math.ceil(hexData.length / 64.0);
  for(let i=0; i<count; i++) {
    if((i+1)*64 < hexData.length) {
      var bi = BigInteger(hexData.substring(i*64, (i+1)*64), 16);
      result.push(bi);
    } else {
      var last = hexData.substring(i*64, hexData.length);
      let n = 64 - last.length;
      for(let j=0; j<n; j++) {
        last += "0";
      }
      var bi = BigInteger(last, 16);
      result.push(bi);
    }
  }
  return result;
};

// Remove right character '0'
SSS.trimRight = function(s) {
  let i = s.length - 1;
  while(i >= 0 && s[i] === '0') {
    --i;
  }
  return s.substring(0, i + 1);
};

// Converts an array of BigInteger to the original byte array, removing any least significant nulls
SSS.mergeBigIntToString = function(secrets) {
  var result = "";
  var hexData = "";
  for(let i=0; i<secrets.length; i++) {
    let tmp = secrets[i].toString(16);
    let n = 64 - tmp.length;
    for(let j=0; j<n; j++) {
      tmp = "0" + tmp;
    }
    hexData = hexData + tmp;
  }
  // console.log("hexData: " + hexData);
  hexData = this.trimRight(hexData);
  result = Buffer.from(hexData, 'hex').toString('utf8');
  // console.log("result: " + result);
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

/**
 * Returns a new array of secret shares (encoding x,y pairs as Base64 or Hex strings)
 * created by Shamir's Secret Sharing Algorithm requiring a minimum number of
 * share to recreate, of length shares, from the input secret raw as a string
 */
SSS.create = function(minimum, shares, secret, isBase64) {
  var rs = [];

  // Verify minimum isn't greater than shares; there is no way to recreate
  // the original polynomial in our current setup, therefore it doesn't make
  // sense to generate fewer shares than are needed to reconstruct the secret.
  if (minimum <= 0 || shares <= 0) {
    throw new Error("minimum or shares is invalid");
  }
  if (minimum > shares) {
    throw new Error("cannot require more shares then existing");
  }
  if (secret == null || secret.length == 0) {
    throw new Error("secret is NULL or empty");
  }

  // Convert the secret to its respective 256-bit BigInteger representation
  var secrets = this.splitSecretToBigInt(secret);
  // console.log(secrets);

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
      var x = this.randomNumber();
      while(this.inNumbers(numbers, x)) {
        x = this.randomNumber();
      }
      numbers.push(x);

      polynomial[i][j] = x;
    }
  }
  // console.log(polynomial);

  // Create the points object; this holds the (x, y) points of each share.
  // Again, because secrets is an array, each share could have multiple parts
  // over which we are computing Shamir's Algorithm. The last dimension is
  // always two, as it is storing an x, y pair of points.
  // 
  // For every share...
  for(let i=0; i<shares; i++) {
    var s = "";
    // and every part of the secret...
    for(let j=0; j<secrets.length; j++) {
      // generate a new x-coordinate
      var x = this.randomNumber();
      while(this.inNumbers(numbers, x)) {
        x = this.randomNumber();
      }
      numbers.push(x);

      // and evaluate the polynomial at that point
      var y = this.evaluatePolynomial(polynomial, j, x);
      // encode
      if (isBase64) {
        s += this.toBase64Url(x);
        s += this.toBase64Url(y);
      } else {
        s += this.toHex(x);
        s += this.toHex(y);
      }
    }
    rs.push(s);
  }

  return rs;
};

/**
 * Takes a string array of shares encoded in Base64 or Hex created via Shamir's Algorithm.
 * Note: the polynomial will converge if the specified minimum number of shares
 *       or more are passed to this function. Passing thus does not affect it
 *       Passing fewer however, simply means that the returned secret is wrong.
 */
SSS.combine = function(shares, isBase64) {
  var rs = "";
  if (shares == null || shares.length == 0) {
      throw new Error("shares is NULL or empty");
  }

  // Recreate the original object of x, y points, based upon number of shares
  // and size of each share (number of parts in the secret).
  // 
  // points[shares][parts][2]
  var points;
  if (isBase64) {
    points = this.decodeShareBase64(shares);
  } else {
    points = this.decodeShareHex(shares);
  }

  // Use Lagrange Polynomial Interpolation (LPI) to reconstruct the secret.
  // For each part of the secret (clearest to iterate over)...
  var secrets = [];
  let numSecret = points[0].length;
  for(let j=0; j<numSecret; j++) {
    secrets.push(BigInteger.zero);
    // and every share...
    for(let i=0; i<shares.length; i++) { // LPI sum loop
      // remember the current x and y values
      let ax = points[i][j][0]; // ax
      let ay = points[i][j][1]; // ay
      let numerator = BigInteger.one; // LPI numerator
      let denominator = BigInteger.one; // LPI denominator
      // and for every other point...
      for(let k=0; k<shares.length; k++) {
        if(k != i) {
          // combine them via half products
          // x=0 ==> [(0-bx)/(ax-bx)] * ...
          let bx = points[k][j][0]; // bx
          let negbx = bx.negate(); // (0-bx)
          let axbx = ax.subtract(bx).mod(PRIME); // (ax-bx)
          numerator = numerator.multiply(negbx).mod(PRIME); // (0-bx)*...
          denominator = denominator.multiply(axbx).mod(PRIME); // (ax-bx)*...
        }
      }

      // LPI product: x=0, y = ay * [(x-bx)/(ax-bx)] * ...
      // multiply together the points (ay)(numerator)(denominator)^-1 ...
      let fx = ay.multiply(numerator).mod(PRIME);
      fx = fx.multiply(denominator.modInv(PRIME)).mod(PRIME);
      
      // LPI sum: s = fx + fx + ...
      var secret = secrets[j];
      secret = secret.add(fx).mod(PRIME);
      secret = secret.compareTo(BigInteger.zero) > 0 ? secret : secret.add(PRIME);
      secrets[j] = secret;
    }
  }

  // recover secret string.
  // console.log(secrets);
  rs = this.mergeBigIntToString(secrets);
  return rs;
};

// Takes a string array of shares encoded in Hex created via Shamir's
// Algorithm; each string must be of equal length of a multiple of 128 characters
// as a single 128 character share is a pair of 256-bit numbers (x, y).
SSS.decodeShareHex = function(shares) {
  // Recreate the original object of x, y points, based upon number of shares
  // and size of each share (number of parts in the secret).
  // 
  // points[shares][parts][2]
  var points = new Array(shares.length);

  // For each share...
  for(let i=0; i<shares.length; i++) {
    // ensure that it is valid
    if(this.isValidShareHex(shares[i]) == false) {
      throw new Error("one of the shares is invalid");
    }

    // find the number of parts it represents.
    let share = shares[i];
    let count = share.length / 128;
    // console.log("count: " + count);
    points[i] = new Array(count);

    // and for each part, find the x,y pair...
    for(let j=0; j<count; j++) {
      points[i][j] = new Array(2);
      let cshare = share.substring(j*128, (j+1)*128);
      // decoding from Hex.
      points[i][j][0] = this.fromHex(cshare.substring(0, 64));
      points[i][j][1] = this.fromHex(cshare.substring(64, 128));
    }
  }

  return points;
};

// Takes in a given string to check if it is a valid secret
// Requirements:
// 	 Length multiple of 128
//	 Can decode each 64 character block as Hex
// Returns only success/failure (bool)
SSS.isValidShareHex = function(candidate) {
  if(candidate == null || candidate.length == 0) {
    return false;
  }
  if(candidate.length % 128 != 0) {
    return false;
  }
  let count = candidate.length / 64;
  for(let i=0; i<count; i++) {
    let part = candidate.substring(i*64, (i+1)*64);
    let decode = this.fromHex(part);
    // decode <= 0 || decode >= PRIME ==> false
    if(decode.compareTo(BigInteger.zero) <= 0 || decode.compareTo(PRIME) >= 0) {
      return false
    }
  }
  return true;
};

// Takes a string array of shares encoded in Base64 created via Shamir's
// Algorithm; each string must be of equal length of a multiple of 88 characters
// as a single 88 character share is a pair of 256-bit numbers (x, y).
SSS.decodeShareBase64 = function(shares) {
  // Recreate the original object of x, y points, based upon number of shares
  // and size of each share (number of parts in the secret).
  // 
  // points[shares][parts][2]
  var points = new Array(shares.length);

  // For each share...
  for(let i=0; i<shares.length; i++) {
    // ensure that it is valid
    if(this.isValidShareBase64(shares[i]) == false) {
      throw new Error("one of the shares is invalid");
    }

    // find the number of parts it represents.
    let share = shares[i];
    let count = share.length / 88;
    // console.log("count: " + count);
    points[i] = new Array(count);

    // and for each part, find the x,y pair...
    for(let j=0; j<count; j++) {
      points[i][j] = new Array(2);
      let cshare = share.substring(j*88, (j+1)*88);
      // decoding from Hex.
      points[i][j][0] = this.fromBase64Url(cshare.substring(0, 44));
      points[i][j][1] = this.fromBase64Url(cshare.substring(44, 88));
    }
  }

  return points;
};

// Takes in a given string to check if it is a valid secret
// Requirements:
// 	 Length multiple of 88
//	 Can decode each 44 character block as Hex
// Returns only success/failure (bool)
SSS.isValidShareBase64 = function(candidate) {
  if(candidate == null || candidate.length == 0) {
    return false;
  }
  if(candidate.length % 88 != 0) {
    return false;
  }
  let count = candidate.length / 44;
  for(let i=0; i<count; i++) {
    let part = candidate.substring(i*44, (i+1)*44);
    let decode = this.fromBase64Url(part);
    // decode <= 0 || decode >= PRIME ==> false
    if(decode.compareTo(BigInteger.zero) <= 0 || decode.compareTo(PRIME) >= 0) {
      return false
    }
  }
  return true;
};

exports = module.exports = SSS;
