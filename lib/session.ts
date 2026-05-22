import { cookies } from 'next/headers';

export type LocalSession = {
  id: string;
  name: string;
  role: 'customer' | 'admin';
};

const SESSION_COOKIE = 'bb_session';

export function getSession() {
  const raw = cookies().get(SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LocalSession;
  } catch {
    return null;
  }
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}
