

export interface PasswordEncryptionResult {
  encryptedPassword: string;
  encryptionType: 'plain' | 'rsa';
}

class PasswordEncryptor {
  private publicKey: string | null = null;

  private get crypto(): SubtleCrypto {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      return window.crypto.subtle;
    } else if (typeof crypto !== 'undefined' && crypto.subtle) {
      return crypto.subtle;
    } else if (typeof globalThis !== 'undefined' && (globalThis as any).crypto && (globalThis as any).crypto.subtle) {
      return (globalThis as any).crypto.subtle;
    }
    throw new Error('Web Crypto API not available in this environment');
  }

  setPublicKey(publicKey: string): void {
    this.publicKey = publicKey;
  }

  private parsePublicKey(pemKey: string): string {
    let keyStr = String(pemKey || '');

    // 检查是否包含 PEM 标识，如果不包含，可能是 Base64 编码的完整 PEM
    if (!keyStr.includes('-----BEGIN PUBLIC KEY-----')) {
      try {
        // 尝试 Base64 解码
        const decodedPem = atob(keyStr);
        // 检查解码后的字符串是否包含 PEM 标识
        if (decodedPem.includes('-----BEGIN PUBLIC KEY-----')) {
          keyStr = decodedPem;
        }
      } catch (e) {
        // 解码失败，直接使用原始字符串
      }
    }

    const pemContents = keyStr
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, '');

    return pemContents;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async rsaEncryptPassword(password: string): Promise<string> {
    if (!this.publicKey) {
      throw new Error('Public key not set');
    }



    const parsedKey = this.parsePublicKey(this.publicKey);

    const publicKeyDER = this.base64ToArrayBuffer(parsedKey);

    try {
      console.log('开始导入公钥');
      const publicKey = await this.crypto.importKey(
        'spki',
        publicKeyDER,
        {
          name: 'RSA-OAEP',
          hash: { name: 'SHA-256' }
        },
        false,
        ['encrypt']
      );

      const passwordBytes = new TextEncoder().encode(password);

      // 检查密码长度是否超过RSA-OAEP的最大长度
      // 对于2048位RSA密钥，最大明文长度是190字节
      if (passwordBytes.length > 190) {
        throw new Error('Password too long for RSA-OAEP encryption');
      }

      const encrypted = await this.crypto.encrypt(
        {
          name: 'RSA-OAEP',
          hash: { name: 'SHA-256' }
        },
        publicKey,
        passwordBytes
      );

      const result = this.arrayBufferToBase64(encrypted);
      return result;
    } catch (error) {
      console.error('RSA encryption error:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  async preparePasswordForLogin(
    password: string,
    useEncryption: boolean = true
  ): Promise<PasswordEncryptionResult> {
    if (!useEncryption) {
      return {
        encryptedPassword: password,
        encryptionType: 'plain'
      };
    }

    const encryptedPassword = await this.rsaEncryptPassword(password);

    return {
      encryptedPassword: encryptedPassword,
      encryptionType: 'rsa'
    };
  }

  async preparePasswordForRegistration(
    password: string,
    useEncryption: boolean = true
  ): Promise<{ password: string; encryption: string }> {
    if (!useEncryption) {
      return {
        password: password,
        encryption: 'plain'
      };
    }

    const encryptedPassword = await this.rsaEncryptPassword(password);

    return {
      password: encryptedPassword,
      encryption: 'RSA-OAEP'
    };
  }

  clearPublicKey(): void {
    this.publicKey = null;
  }

  hasPublicKey(): boolean {
    return this.publicKey !== null;
  }

  setPublicKey(key: string): void {
    this.publicKey = key;
  }
}

export const passwordEncryptor = new PasswordEncryptor();
export const passwordCryptoService = passwordEncryptor;

export default passwordEncryptor;
