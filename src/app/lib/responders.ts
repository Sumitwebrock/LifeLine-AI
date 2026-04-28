export type ResponderProfile = {
  id: string;
  name: string;
  role: string;
  phone: string;
  location: string;
  status: string;
  distance: string;
  rating: number;
  emergencies: number;
  avatar: string;
};

export const RESPONDER_STORAGE_KEY = 'lifeline-responder-profiles';
export const RESPONDER_UPDATE_EVENT = 'lifeline-responder-profiles-updated';

export const defaultResponders: ResponderProfile[] = [
  {
    id: 'default-priya',
    name: 'Dr. Priya Sharma',
    role: 'Doctor',
    phone: '+91 98765 11111',
    location: 'Koramangala',
    status: 'On the way',
    distance: '1.2 km',
    rating: 4.9,
    emergencies: 127,
    avatar: 'PS',
  },
  {
    id: 'default-arjun',
    name: 'Arjun Kumar',
    role: 'Volunteer',
    phone: '+91 98765 22222',
    location: 'Indiranagar',
    status: 'Accepted',
    distance: '800 m',
    rating: 4.8,
    emergencies: 89,
    avatar: 'AK',
  },
  {
    id: 'default-ravi',
    name: 'Ravi Chandra',
    role: 'Driver',
    phone: '+91 98765 33333',
    location: 'BTM Layout',
    status: 'On the way',
    distance: '1.5 km',
    rating: 4.7,
    emergencies: 156,
    avatar: 'RC',
  },
];

export function getStoredResponders() {
  if (typeof window === 'undefined') {
    return defaultResponders;
  }

  const raw = window.localStorage.getItem(RESPONDER_STORAGE_KEY);
  if (!raw) {
    return defaultResponders;
  }

  try {
    const saved = JSON.parse(raw) as ResponderProfile[];
    return [...saved, ...defaultResponders.filter((responder) => !saved.some((item) => item.id === responder.id))];
  } catch {
    return defaultResponders;
  }
}

export function saveResponderProfile(profile: ResponderProfile) {
  const responders = getStoredResponders();
  const nextResponders = [profile, ...responders.filter((responder) => responder.id !== profile.id)];

  window.localStorage.setItem(RESPONDER_STORAGE_KEY, JSON.stringify(nextResponders));
  window.dispatchEvent(new Event(RESPONDER_UPDATE_EVENT));

  return nextResponders;
}

export function createResponderId(name: string, phone: string) {
  const source = `${name}-${phone}-${Date.now()}`.toLowerCase();
  return source.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
