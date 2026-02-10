export interface IKeyGenerator {
  generateKeyPair(): { publicKey: string; privateKey: string };
  encryptPrivateKey(privateKey: string): string;
  decryptPrivateKey(encryptedPrivateKey: string): string;
}
