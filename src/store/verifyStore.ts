interface VerifyAttempt {
  timestamp: number;
  ip: string;
  success: boolean;
  account?: string;
}

interface VerifyConfig {
  maxAttemptsPerWindow: number;
  windowSizeMs: number;
  lockoutDurationMs: number;
  maxFailedAttempts: number;
}

const DEFAULT_CONFIG: VerifyConfig = {
  maxAttemptsPerWindow: 5,
  windowSizeMs: 60000,
  lockoutDurationMs: 300000,
  maxFailedAttempts: 3
};

class VerifyManager {
  private attempts: VerifyAttempt[] = [];
  private lockoutUntil: number = 0;
  private config: VerifyConfig;

  constructor(config: Partial<VerifyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('verify_attempts');
      if (stored) {
        const data = JSON.parse(stored);
        this.attempts = data.attempts || [];
        this.lockoutUntil = data.lockoutUntil || 0;
      }
    } catch {
      this.attempts = [];
      this.lockoutUntil = 0;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('verify_attempts', JSON.stringify({
        attempts: this.attempts,
        lockoutUntil: this.lockoutUntil
      }));
    } catch {
      // ignore
    }
  }

  isLocked(): boolean {
    if (this.lockoutUntil > Date.now()) {
      return true;
    }
    if (this.lockoutUntil > 0) {
      this.lockoutUntil = 0;
      this.saveToStorage();
    }
    return false;
  }

  getRemainingLockoutTime(): number {
    if (this.lockoutUntil > Date.now()) {
      return this.lockoutUntil - Date.now();
    }
    return 0;
  }

  recordAttempt(success: boolean, account?: string): { blocked: boolean; reason?: string } {
    if (this.isLocked()) {
      const remaining = Math.ceil(this.getRemainingLockoutTime() / 1000);
      return {
        blocked: true,
        reason: `注册已锁定，请在 ${remaining} 秒后重试`
      };
    }

    const now = Date.now();
    const windowStart = now - this.config.windowSizeMs;

    this.attempts = this.attempts.filter(a => a.timestamp > windowStart);

    const failedAttempts = this.attempts.filter(a => !a.success).length;
    if (failedAttempts >= this.config.maxFailedAttempts) {
      this.lockoutUntil = now + this.config.lockoutDurationMs;
      this.saveToStorage();
      return {
        blocked: true,
        reason: `检测到异常注册行为，注册功能已暂时锁定，请在 ${Math.ceil(this.config.lockoutDurationMs / 1000)} 秒后重试`
      };
    }

    const attempt: VerifyAttempt = {
      timestamp: now,
      ip: this.getClientIP(),
      success,
      account
    };

    this.attempts.push(attempt);
    this.saveToStorage();

    if (this.attempts.length >= this.config.maxAttemptsPerWindow) {
      const recentAttempts = this.attempts.filter(a => a.timestamp > windowStart);
      const uniqueAccounts = new Set(recentAttempts.map(a => a.account).filter(Boolean));

      if (uniqueAccounts.size >= 3) {
        this.lockoutUntil = now + this.config.lockoutDurationMs;
        this.saveToStorage();
        return {
          blocked: true,
          reason: `检测到频繁注册行为，请稍后再试`
        };
      }
    }

    return { blocked: false };
  }

  private getClientIP(): string {
    try {
      const stored = sessionStorage.getItem('client_ip');
      if (stored) return stored;

      const randomIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      sessionStorage.setItem('client_ip', randomIP);
      return randomIP;
    } catch {
      return 'unknown';
    }
  }

  getStats() {
    const now = Date.now();
    const windowStart = now - this.config.windowSizeMs;
    const recentAttempts = this.attempts.filter(a => a.timestamp > windowStart);

    return {
      totalAttempts: recentAttempts.length,
      failedAttempts: recentAttempts.filter(a => !a.success).length,
      isLocked: this.isLocked(),
      lockoutRemaining: this.getRemainingLockoutTime(),
      uniqueAccounts: new Set(recentAttempts.map(a => a.account).filter(Boolean)).size
    };
  }

  reset() {
    this.attempts = [];
    this.lockoutUntil = 0;
    this.saveToStorage();
  }
}

export const verifyManager = new VerifyManager();

export const verifyAccountForRegister = (account: string): { valid: boolean; message?: string } => {
  const patterns = [
    /^(admin|root|super|system|guest|test)/i,
    /(.)\1{3,}/,
    /^[^a-zA-Z]/,
    /[^a-zA-Z0-9_]/
  ];

  const messages = [
    '账号不能以敏感词开头',
    '账号不能包含重复字符',
    '账号必须以字母开头',
    '账号只能包含字母、数字和下划线'
  ];

  for (let i = 0; i < patterns.length; i++) {
    if (patterns[i].test(account)) {
      return { valid: false, message: messages[i] };
    }
  }

  return { valid: true };
};

export const verifyPasswordStrength = (password: string): { valid: boolean; message?: string; strength: 'weak' | 'medium' | 'strong' } => {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位', strength: 'weak' };
  }

  if (password.length > 20) {
    return { valid: false, message: '密码长度不能超过20位', strength: 'weak' };
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const checks = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password)
  ];

  const passedChecks = checks.filter(Boolean).length;

  if (passedChecks >= 3 && password.length >= 8) {
    strength = 'strong';
  } else if (passedChecks >= 2 && password.length >= 6) {
    strength = 'medium';
  }

  if (strength === 'weak') {
    return { valid: false, message: '密码强度太弱，请使用字母、数字和特殊字符的组合', strength };
  }

  return { valid: true, strength };
};
