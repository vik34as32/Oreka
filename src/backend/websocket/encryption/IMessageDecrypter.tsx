export default interface IMessageEncryptDecrypter {
    decrypt: (message: string) => string;
    encrypt: (message: Map<string, any>) => string;
}