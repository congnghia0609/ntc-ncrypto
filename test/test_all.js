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


// // Test1:
// var s = "nghiatcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// console.log(s);
// console.log(s.length);
// // creates a set of shares
// var arr = sss.create(3, 6, s);
// // console.log(arr);

// // combines shares into secret
// var a1 = arr.slice(0, 3);
// var s1 = sss.combine(a1);
// console.log("combines shares 1 length = " + a1.length);
// console.log("secret: " + s1);
// console.log("secret.length: " + s1.length);

// var a2 = arr.slice(3, 6);
// var s2 = sss.combine(a2);
// console.log("combines shares 2 length = " + a2.length);
// console.log("secret: " + s2);
// console.log("secret.length: " + s2.length);

// var a3 = arr.slice(1, 5);
// var s3 = sss.combine(a3);
// console.log("combines shares 3 length = " + a3.length);
// console.log("secret: " + s3);
// console.log("secret.length: " + s3.length);


// Test2:
var s = "nghiatcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
console.log(s);
console.log(s.length);
// creates a set of shares
var arr = [
  "cac78fd8a2491872833bf9049cb91f706ae7c6619c8dcd11d2b93db1a42610c8d16221744779f7d1df1152d128f1c4e665fcc7d5f9c5da8c5a3954795d14e7fa882ede5e95cc86c133369f0069086a84e7dfa36a8004f6365eebc798ac467f988c5063932ea32066270dc4c18da124f7593ef71491c9e6d7b838f33524449f47c64902a4bd32d020691044daa01dbbfdc7b3a5e8fb20d546e3eac08986e50449ef4340426e494113245e49f672151e86b9da58e122673665a807cc1c04dbe7bc0151a94de40f618b470d73f90b93ede1b7d1611b6f6cb020d9ec12cd7d7bfd471f108d6caa60e3e4c933c78863ed9b8672a37270909ceca95f16e6d3f3dde55f",
  "173a962eac9997a9cbd24fa9f664c7a4e90134985344d80332d52b099fa7dfb16ada3209a95af9732b197b1b9bd9067b5f8a0053635a4bc538d60d626576fb1d2ceb4145d68125447c7716a72db869abbe56d649f53e47316bcf9ce165008a93c03ca42840f92ff5c35433375ddf3bbcbf2a8cdffdd475c9c20733b278121adec6d35a0bc80bee9311f814bea1d9783981e042f210d459e8818df76f8b541a72825274df2d5ac29e0074396e7922849d663acdd84919e113dad867a8257d571d3f8e3644dfe790f6f0192fcad5c8735ee4658de1ae03285d721d92119aafc77ffcd9bc7e80da7b47c12ae8cfc730f397cd8533889d4fc96e7f0d4d5fc49d3db9",
  "d64848bb07b603d7f882017750c260b4c9fc067dbe97bc49903e7e9a80314dd5d77398b0adcc2e6dbba02e166f93cc15f5b0cdf982abe0879ba1f530d70c9aae0e2fd6764b88616a92c5a3e1b470c19ae94b34284343a106482c15a19381a164bdd3952c55576ad95687100c59dc857b78dfc436ce7f8525420ae273ca58619df6f952772b2e0a785a10c24b77791208bcb6d0ab8c874e7b3f53e522b50855d01566b9f20d4a69136afd25f6cbf127c34650552bf1e1b2885b83fc8fe42bbbc5c3be42dec0b98b4d72a6ff118ca4c49a3055b4bdf7b1e251f7ee61d94fc04bd6d7562dd210d806911ba055ff1f5100808cf350922d4d527058112ac36ea098a2",
  "18ad9f41e1a4076fa139da699624686a32b9388cd8931c0f9278ae705ef6693c072d1d4885034672127061f2ce28e3af65c0bcd45024420adaa9df15f6ecee61cf586adcdc7a18981d85ca0ffbd58ad4b82ab15dabf0729aa7d99ce0b4013f3b7318d191cd1450fbea27488e0c4043ba2dfcfc484bdab19cb72b389bcc947c38a1d8cabe59f8f6ce7e878a4c250996835806a354fb4a177510f6a5f2a603686f3e3e9b6c82a8073ad96f49ea5ca470ef6e560a55e74699221df3953ce8747ea461ec0d9d7435eb9526a9a73e5181873c8a05b6711314902af4cf0a9bc69336e818684510273d27752ff0b2b2977f46573033a95b77fe99e004f726633070d1b8",
  "188fd844683b4f1f3b65f03ae4624166a7f7378129c946ed9bbcb5cc23c6b77e5325340b89656394711c25c5500bcc789105ee4bbc9f1c8a3a90d261d8c29feda7647cdf1f88c918a4a4afe5af0e8820c779b3b98540571a2f8603996a0dfb8c1bce6440a7f07288fedc9fa66f86548b8ca521efd3df208fe8a3118b929ebed88db91d5a85d54974742764b7a3709699aad5c3933b9b769bc02f8d27f25ea2df5d73c4607dad720b57e07454f58327e6bf55a833fa5f012a6b7012ef5d0cd4ab7ca9871107ac2a17235d925dd7fd767aa0115d4c5c7b73fe165718895401cf58ec830f95dd4af709064a1c5737b9378775f95c41d078aca3701d50296df1a0af",
  "5d486655b69532b179d825639fe8648cfe468719211f52d35fc9facd8c8572b33e6206aeb819dd96b22f6ade3533f502e1015ca765a236e7ddedf8b5a95bb7f4fa5b1fce132f7ca624a4d4f2adf14e7c31487a35a4685552e2ab149510c4c11a8c6bb5fa21b058b7de597abbe9ddbb178f293ddd07ee15304618b4855696e180e1afae690e15b623941bf719289ea5e72fa597aeb77b133ce409c5cca4e2a5125f1d7e8f085eb5341ba5eab68f80e7382d52a3145dd3c357ddcf2f883e4acf3324a5ab08ad2fb76d22500581d2aa496938ef650f52af5fbb7aae4779f436101a950953cf77433cb6fafa8c0346c716d456e988b4e05861a239bf643860a7340a",
];
// console.log(arr);

// combines shares into secret
var a1 = arr.slice(0, 3);
var s1 = sss.combine(a1);
console.log("combines shares 1 length = " + a1.length);
console.log("secret: " + s1);
console.log("secret.length: " + s1.length);

var a2 = arr.slice(3, 6);
var s2 = sss.combine(a2);
console.log("combines shares 2 length = " + a2.length);
console.log("secret: " + s2);
console.log("secret.length: " + s2.length);

var a3 = arr.slice(1, 5);
var s3 = sss.combine(a3);
console.log("combines shares 3 length = " + a3.length);
console.log("secret: " + s3);
console.log("secret.length: " + s3.length);
