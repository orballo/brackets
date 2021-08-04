import CryptoJS from "crypto-es";

const SECRET = "torneo";

export function encrypt(plainText: string) {
  const b64 = CryptoJS.Rabbit.encrypt(plainText, SECRET).toString();
  const e64 = CryptoJS.enc.Base64.parse(b64);
  const eHex = e64.toString(CryptoJS.enc.Hex);
  return eHex;
}

export function decrypt(cipherText: string) {
  const reb64 = CryptoJS.enc.Hex.parse(cipherText);
  const bytes = reb64.toString(CryptoJS.enc.Base64);
  const decrypt = CryptoJS.Rabbit.decrypt(bytes, SECRET);
  const plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
}
