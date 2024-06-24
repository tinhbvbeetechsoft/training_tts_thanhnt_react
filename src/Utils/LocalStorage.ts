import * as CryptoJS from 'crypto-js';

class Crypto {
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

class LocalStorage {
  instanceName = '_Storage';
  KEYS = {
    COLLAPSE_MENU: '_STATE_COLLAPSE_MENU'
  };

  setUserToken(userToken: any) {
    return this.set('userToken', userToken);
  }

  set(key: string, val: any) {
    let storedData = this.storedData();
    if (storedData == null) {
      storedData = {};
    }
    storedData[key] = val;
    localStorage.setItem(this.instanceName, Crypto.encr(storedData));
  }

  storedData() {
    const storedData = localStorage.getItem(this.instanceName);
    if (!storedData || (storedData + '').trim() === '') {
      return null;
    }
    return Crypto.decr(storedData);
  }

  get(key: string) {
    const storedData = this.storedData();
    if (storedData == null) {
      return null;
    }
    return storedData[key];
  }

  clear() {
    localStorage.removeItem(this.instanceName);
  }
}

export default new LocalStorage();
