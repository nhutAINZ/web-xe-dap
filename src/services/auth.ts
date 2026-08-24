import { UserSession } from '../types';

const SESSION_KEY = 'dxd_auth_session_v2';
const ATTEMPTS_KEY = 'dxd_auth_attempts_v2';

export const auth = {
  getCurrentUser(): UserSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  login(username: string, password: string,captchaValue?: string): { success: boolean; message: string; user?: UserSession } {
    const attempts = this.getFailedAttempts();
    if (attempts >= 5) {
      return { success: false, message: 'Đăng nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút!' };
    }

    const cleanUser = username.trim().toLowerCase();
    
    // Preset demo accounts
    if (cleanUser === 'admin' && password === '123456') {
      const user: UserSession = {
        id: 'usr-admin-1',
        username: 'admin',
        fullName: 'Quản Trị Viên Trưởng',
        role: 'admin',
        token: 'token-admin-' + Date.now()
      };
      this.setSession(user);
      this.clearFailedAttempts();
      return { success: true, message: 'Đăng nhập thành công với quyền Quản trị!', user };
    }

    if (cleanUser === 'staff' && password === '123456') {
      const user: UserSession = {
        id: 'usr-staff-1',
        username: 'staff',
        fullName: 'Nhân Viên Bán Hàng',
        role: 'staff',
        token: 'token-staff-' + Date.now()
      };
      this.setSession(user);
      this.clearFailedAttempts();
      return { success: true, message: 'Đăng nhập thành công với quyền Nhân viên POS/CRM!', user };
    }

    this.recordFailedAttempt();
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác (Gợi ý: admin / 123456 hoặc staff / 123456)' };
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  setSession(user: UserSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getFailedAttempts(): number {
    return parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10);
  },

  recordFailedAttempt(): void {
    const cur = this.getFailedAttempts() + 1;
    localStorage.setItem(ATTEMPTS_KEY, cur.toString());
  },

  clearFailedAttempts(): void {
    localStorage.removeItem(ATTEMPTS_KEY);
  }
};
