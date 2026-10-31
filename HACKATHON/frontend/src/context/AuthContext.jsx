import React, { createContext, useContext, useState, useEffect } from 'react';
import { SEED_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ccms_user') || localStorage.getItem('klh_ccms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ccms_token') || localStorage.getItem('klh_ccms_token') || null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('ccms_registered_users');
    if (!saved) return SEED_USERS;
    try {
      const parsed = JSON.parse(saved);
      // Ensure all current SEED_USERS are included
      const seedEmails = new Set(SEED_USERS.map(s => s.email.toLowerCase()));
      const customUsers = parsed.filter(p => !seedEmails.has(p.email.toLowerCase()));
      return [...SEED_USERS, ...customUsers];
    } catch {
      return SEED_USERS;
    }
  });

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('ccms_user', JSON.stringify(user));
      localStorage.setItem('ccms_token', token);
    } else {
      localStorage.removeItem('ccms_user');
      localStorage.removeItem('ccms_token');
    }
  }, [user, token]);

  useEffect(() => {
    localStorage.setItem('ccms_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Helper to generate a simulated JWT token
  const createMockToken = (userObj) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: userObj.email,
      role: userObj.role,
      userId: userObj.id,
      name: userObj.name,
      collegeId: userObj.collegeId || 'nit-warangal',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }));
    const signature = btoa('campus_ccms_secret_signature_jwt');
    return `${header}.${payload}.${signature}`;
  };

  // 1. Student / Faculty Login
  const loginStudent = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check registered or seed users
    const matched = registeredUsers.find(
      u => u.email.toLowerCase() === trimmedEmail && (u.role === 'STUDENT' || u.role === 'FACULTY')
    );

    if (!matched) {
      throw new Error('No Student/Faculty account found with this email. Select one from Demo Accounts or register.');
    }

    if (matched.password !== password) {
      throw new Error('Incorrect password. For demo, use: Password@123');
    }

    const jwt = createMockToken(matched);
    setUser(matched);
    setToken(jwt);
    return matched;
  };

  // 2. Admin Login
  const loginAdmin = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const matched = registeredUsers.find(
      u => u.email.toLowerCase() === trimmedEmail && u.role === 'ADMIN'
    );

    if (!matched) {
      throw new Error('Access denied. No Administrator account found with this email.');
    }

    if (matched.password !== password) {
      throw new Error('Incorrect administrator password. Demo: Admin@123');
    }

    const jwt = createMockToken(matched);
    setUser(matched);
    setToken(jwt);
    return matched;
  };

  // 3. Maintenance Staff Login
  const loginStaff = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const matched = registeredUsers.find(
      u => u.email.toLowerCase() === trimmedEmail && u.role === 'STAFF'
    );

    if (!matched) {
      throw new Error('Access denied. No Maintenance Staff account found with this email.');
    }

    if (matched.password !== password) {
      throw new Error('Incorrect staff password. Demo: Staff@123');
    }

    const jwt = createMockToken(matched);
    setUser(matched);
    setToken(jwt);
    return matched;
  };

  // 4. Register new Student or Faculty
  const registerStudent = (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const exists = registeredUsers.some(u => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      throw new Error('An account with this email address already exists. Please login instead.');
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      role: userData.role || 'STUDENT',
      roleLabel: userData.role === 'FACULTY' ? 'Faculty Complainant' : 'Student Complainant',
      avatar: userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    
    // Auto-login registered user
    const jwt = createMockToken(newUser);
    setUser(newUser);
    setToken(jwt);
    return newUser;
  };

  // 5. Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ccms_user');
    localStorage.removeItem('ccms_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      registeredUsers,
      isAuthenticated: !!user,
      loginStudent,
      loginAdmin,
      loginStaff,
      registerStudent,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
