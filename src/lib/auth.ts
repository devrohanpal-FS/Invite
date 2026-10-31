export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  invites?: string[];
}

const USERS_STORAGE_KEY = 'zareqia_registered_users';
const CURRENT_USER_KEY = 'zareqia_current_user';

export function getRegisteredUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to get registered users', err);
    return [];
  }
}

export function registerUser(name: string, email: string, password?: string): { success: boolean; user?: User; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Window not available' };
  
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName) {
    return { success: false, error: 'Name is required' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Valid email is required' };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email === cleanEmail);
  if (existing) {
    // If already exists, log them in
    setCurrentUser(existing);
    return { success: true, user: existing };
  }

  const newUser: User = {
    id: 'user_' + Date.now(),
    name: cleanName,
    email: cleanEmail,
    password: password || '',
    createdAt: new Date().toISOString(),
    invites: [],
  };

  users.push(newUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  } catch (err) {
    console.error('Failed to save user', err);
    return { success: false, error: 'Failed to save account' };
  }
}

export function loginUser(email: string, password?: string): { success: boolean; user?: User; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Window not available' };

  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find((u) => u.email === cleanEmail);

  if (user) {
    if (user.password && password && user.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }
    setCurrentUser(user);
    return { success: true, user };
  }

  // If user doesn't exist yet, auto-create account for seamless demo / test access
  const nameFromEmail = cleanEmail.split('@')[0];
  const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
  return registerUser(capitalizedName, cleanEmail, password);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to set current user', err);
  }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (err) {
    console.error('Failed to logout', err);
  }
}

export function linkInviteToCurrentUser(slug: string): void {
  if (typeof window === 'undefined') return;
  const current = getCurrentUser();
  if (!current) return;

  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === current.id);
  const invites = current.invites || [];

  if (!invites.includes(slug)) {
    invites.push(slug);
    current.invites = invites;
    setCurrentUser(current);

    if (index !== -1) {
      users[index].invites = invites;
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (err) {
        console.error('Failed to update user invites', err);
      }
    }
  }
}
