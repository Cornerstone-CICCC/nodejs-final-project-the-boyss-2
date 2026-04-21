import { atom } from 'nanostores';

const API_URL = 'http://localhost:3000/api/auth';

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  createdAt: string;
}

export const $user = atom<User | null>(null);
export const $isLoading = atom<boolean>(true);

let initialized = false;

export async function checkAuth(): Promise<User | null> {
  // If already initialized this session, return cached state
  if (initialized) {
    $isLoading.set(false);
    return $user.get();
  }

  // Try sessionStorage first
  const cached = sessionStorage.getItem('devfeed_user');
  if (cached) {
    const user: User = JSON.parse(cached);
    $user.set(user);
    $isLoading.set(false);
    initialized = true;

    // Validate in background (don't block)
    fetch(`${API_URL}/me`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          clearAuth();
          window.location.href = '/login';
        }
      })
      .catch(() => {});

    return user;
  }

  // No cache, fetch from server
  try {
    const res = await fetch(`${API_URL}/me`, { credentials: 'include' });
    if (res.ok) {
      const { user }: { user: User } = await res.json();
      $user.set(user);
      sessionStorage.setItem('devfeed_user', JSON.stringify(user));
      initialized = true;
      $isLoading.set(false);
      return user;
    }
  } catch {
    // Network error
  }

  $user.set(null);
  $isLoading.set(false);
  initialized = true;
  return null;
}

export function setAuth(user: User): void {
  $user.set(user);
  sessionStorage.setItem('devfeed_user', JSON.stringify(user));
  initialized = true;
}

export function clearAuth(): void {
  $user.set(null);
  sessionStorage.removeItem('devfeed_user');
  initialized = false;
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  clearAuth();
  window.location.href = '/login';
}

// Guards
export async function requireAuth(): Promise<User> {
  const user = await checkAuth();
  if (!user) {
    window.location.href = '/login';
    // Return a never-resolving promise to prevent page rendering
    return new Promise(() => {});
  }
  return user;
}

export async function requireGuest(): Promise<void> {
  const user = await checkAuth();
  if (user) {
    window.location.href = '/dashboard';
    return new Promise(() => {});
  }
}
