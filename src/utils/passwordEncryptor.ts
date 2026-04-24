

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

    console.log('开始RSA加密');
    console.log('原始密码:', password);
    console.log('密码长度:', password.length);

    const parsedKey = this.parsePublicKey(this.publicKey);
    console.log('解析后的公钥长度:', parsedKey.length);

    const publicKeyDER = this.base64ToArrayBuffer(parsedKey);
    console.log('公钥DER长度:', publicKeyDER.byteLength);

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
      console.log('公钥导入成功');

      const passwordBytes = new TextEncoder().encode(password);
      console.log('密码字节长度:', passwordBytes.length);

      // 检查密码长度是否超过RSA-OAEP的最大长度
      // 对于2048位RSA密钥，最大明文长度是190字节
      if (passwordBytes.length > 190) {
        throw new Error('Password too long for RSA-OAEP encryption');
      }

      console.log('开始加密');
      const encrypted = await this.crypto.encrypt(
        {
          name: 'RSA-OAEP',
          hash: { name: 'SHA-256' }
        },
        publicKey,
        passwordBytes
      );
      console.log('加密成功，加密数据长度:', encrypted.byteLength);

      const result = this.arrayBufferToBase64(encrypted);
      console.log('加密结果长度:', result.length);
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
}

export const passwordEncryptor = new PasswordEncryptor();
export const passwordCryptoService = passwordEncryptor;

export default passwordEncryptor;
