export interface ILoginAttemptResult {
  success: boolean;
  attemptsRemaining: number;
  isNowLocked: boolean;
}

export interface IAccountLockStatus {
  isLocked: boolean;
  minutesRemaining: number;
}

export interface IRedisAccountSecurity {
  trackLoginAttempt(email: string, success: boolean): Promise<ILoginAttemptResult>;
  isAccountLocked(email: string): Promise<IAccountLockStatus>;
  resetLoginAttempts(email: string): Promise<void>;
}
