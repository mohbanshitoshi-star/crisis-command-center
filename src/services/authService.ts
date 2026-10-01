export interface User {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: string;
  authMethod: 'google' | 'email' | 'phone';
}

const STORAGE_KEY_USER = 'aegis_auth_user';
const STORAGE_KEY_USERS_DB = 'aegis_users_db';
const STORAGE_KEY_ACTIVE_OTP = 'aegis_active_otp';

interface StoredUserRecord {
  user: User;
  passwordHash?: string;
}

// Seed default accounts if not already present
const getStoredUsers = (): Record<string, StoredUserRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse users db:', e);
  }

  // Pre-seed Toshi account, Demo email account, and a test phone number
  const initialUsers: Record<string, StoredUserRecord> = {
    'mohbanshitoshi@gmail.com': {
      user: {
        id: 'usr_toshi_1',
        fullName: 'Toshi Banshi',
        email: 'mohbanshitoshi@gmail.com',
        role: 'Strategic Intelligence Lead',
        authMethod: 'email',
      },
      passwordHash: 'password123',
    },
    'demo@aegis.ai': {
      user: {
        id: 'usr_demo_1',
        fullName: 'Intelligence Analyst',
        email: 'demo@aegis.ai',
        role: 'Operations Analyst',
        authMethod: 'email',
      },
      passwordHash: 'password123',
    },
    '+919876543210': {
      user: {
        id: 'usr_phone_demo',
        fullName: 'Field Operations Specialist',
        phoneNumber: '+91 98765 43210',
        role: 'Tactical Operator',
        authMethod: 'phone',
      },
    },
  };

  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(initialUsers));
  return initialUsers;
};

export const authService = {
  // Method 1: Continue with Google
  loginWithGoogle: async (): Promise<User> => {
    // Artificial small delay for realistic OAuth loading state
    await new Promise((resolve) => setTimeout(resolve, 600));

    const googleUser: User = {
      id: `usr_google_${Date.now()}`,
      fullName: 'Toshi Banshi',
      email: 'mohbanshitoshi@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Strategic Intelligence Lead',
      authMethod: 'google',
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(googleUser));
    return googleUser;
  },

  // Method 2: Continue with Email - Login
  loginWithEmail: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const existing = users[normalizedEmail];

    if (!existing) {
      // Dynamic fallback for hackathon testers
      if (password.length >= 6) {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          fullName: normalizedEmail.split('@')[0].replace('.', ' '),
          email: normalizedEmail,
          role: 'Intelligence Analyst',
          authMethod: 'email',
        };
        users[normalizedEmail] = { user: newUser, passwordHash: password };
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
        return newUser;
      }
      throw new Error('No account found with this email. Please check your credentials or create an account.');
    }

    if (existing.passwordHash && existing.passwordHash !== password) {
      throw new Error('Incorrect password. Please verify your password and try again.');
    }

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existing.user));
    return existing.user;
  },

  // Method 2: Continue with Email - Sign Up
  signupWithEmail: async (fullName: string, email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    if (users[normalizedEmail]) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      role: 'Intelligence Analyst',
      authMethod: 'email',
    };

    users[normalizedEmail] = {
      user: newUser,
      passwordHash: password,
    };

    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return newUser;
  },

  // Backward compatibility alias
  login: async (email: string, password: string): Promise<User> => {
    return authService.loginWithEmail(email, password);
  },

  // Backward compatibility alias
  signup: async (fullName: string, email: string, password: string): Promise<User> => {
    return authService.signupWithEmail(fullName, email, password);
  },

  // Method 3: Continue with Phone Number + OTP
  sendPhoneOtp: async (countryCode: string, phoneNumber: string): Promise<{ otpCode: string; expiresAt: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 8) {
      throw new Error('Please enter a valid phone number (at least 8-10 digits).');
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const otpCode = '123456'; // Standard realistic hackathon OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store in session
    sessionStorage.setItem(
      STORAGE_KEY_ACTIVE_OTP,
      JSON.stringify({ phone: fullPhone, otp: otpCode, expiresAt })
    );

    return { otpCode, expiresAt };
  },

  verifyPhoneOtp: async (
    countryCode: string,
    phoneNumber: string,
    enteredOtp: string,
    isSignUp: boolean = false,
    fullName?: string
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const cleanKey = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    // Verify OTP against stored OTP or accepted universal demo code '123456'
    let storedOtp = '123456';
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_ACTIVE_OTP);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.otp) storedOtp = parsed.otp;
      }
    } catch (e) {}

    if (enteredOtp !== storedOtp && enteredOtp !== '123456') {
      throw new Error('Invalid OTP. Please check the 6-digit code and try again (Demo code: 123456).');
    }

    const users = getStoredUsers();
    let existing = users[cleanKey];

    if (!existing) {
      // Create new user for phone
      const generatedName = fullName?.trim() || `User ${phoneNumber.slice(-4)}`;
      const newUser: User = {
        id: `usr_phone_${Date.now()}`,
        fullName: generatedName,
        phoneNumber: fullPhone,
        role: 'Field Operator',
        authMethod: 'phone',
      };

      users[cleanKey] = { user: newUser };
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      return newUser;
    }

    // Existing phone user
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existing.user));
    return existing.user;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_ACTIVE_OTP);
  },

  getCurrentUser: (): User | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to get current user:', e);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },
};
