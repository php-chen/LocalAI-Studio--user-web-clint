import forge from 'node-forge';

export interface PasswordEncryptionResult {
  encryptedPassword: string;
  encryptionType: 'plain' | 'rsa';
}

class PasswordEncryptor {
  private publicKey: string | null = null;



  private parsePublicKey(pemKey: string): string {
    let keyStr = String(pemKey || '');

    // 第一步：保留原始换行，先检查是否已经是完整 PEM
    if (keyStr.includes('-----BEGIN PUBLIC KEY-----')) {
      // 已经是完整 PEM，规范化一下
      return keyStr.replace(/\r/g, '').trim();
    }

    // 第二步：尝试直接使用原始内容，可能是多行 Base64 公钥
    // 移除可能存在的换行，然后添加 PEM 包装
    const cleanKey = keyStr
      .replace(/\r/g, '')
      .replace(/\n/g, '')
      .replace(/\s+/g, '');

    const formattedPem = '-----BEGIN PUBLIC KEY-----\n' + cleanKey + '\n-----END PUBLIC KEY-----';

    console.log('Formatted PEM:', formattedPem);

    return formattedPem;
  }

  private rsaEncryptPassword(password: string): string {
    if (!this.publicKey) {
      throw new Error('Public key not set');
    }

    const parsedKey = this.parsePublicKey(this.publicKey);

    try {
      console.log('原始公钥:', this.publicKey?.substring(0, 100) + '...');
      console.log('解析后公钥:', parsedKey);
      console.log('开始导入公钥');

      let publicKey;
      try {
        // 方法1: 标准 PEM 解析
        publicKey = forge.pki.publicKeyFromPem(parsedKey);
      } catch (parseError) {
        console.log('标准 PEM 解析失败，尝试备用方法...');
        // 方法2: 尝试直接提取裸 Base64 部分并解析
        const body = parsedKey
          .replace(/-----BEGIN PUBLIC KEY-----/g, '')
          .replace(/-----END PUBLIC KEY-----/g, '')
          .replace(/\s+/g, '');

        // 从 Base64 解码 DER
        const der = forge.util.decode64(body);
        const asn1 = forge.asn1.fromDer(der);
        publicKey = forge.pki.publicKeyFromAsn1(asn1);
      }

      // 检查密码长度是否超过RSA-OAEP的最大长度
      // 对于2048位RSA密钥，最大明文长度是190字节
      if (password.length > 190) {
        throw new Error('Password too long for RSA-OAEP encryption');
      }

      // 使用 RSA-OAEP + SHA-256 加密
      const encrypted = publicKey.encrypt(
        password,
        'RSA-OAEP',
        {
          md: forge.md.sha256.create(),
          mgf1: {
            md: forge.md.sha256.create()
          }
        }
      );

      // 转换为 Base64
      const result = forge.util.encode64(encrypted);
      console.log('加密成功');
      return result;
    } catch (error: any) {
      console.error('RSA encryption error:', error);
      console.error('Error details:', error.message);
      console.error('解析后的公钥:', parsedKey);
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

    const encryptedPassword = this.rsaEncryptPassword(password);

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

    const encryptedPassword = this.rsaEncryptPassword(password);

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