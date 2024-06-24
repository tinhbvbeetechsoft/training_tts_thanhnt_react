import * as CryptoJS from 'crypto-js';

export class Crypto {
    private static encrText = 'rNZSYvtgfyUPx75Okf6ArEaxx42x2SiktAW9j';
    public static encr(data: any) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), this.encrText).toString();
        } catch (e) {
            console.log(e);
            return '';
        }
    }
    public static decr(data: any) {
        try {
            const bytes = CryptoJS.AES.decrypt(data, this.encrText);
            if (bytes) {
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;
        } catch (e) {
            console.log(e);
        }
    }
}
