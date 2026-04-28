export type EmergencyAlert = {
  id: string;
  type: string;
  location: string;
  coordinates: string;
  time: string;
  status: string;
};

export const EMERGENCY_ALERT_STORAGE_KEY = 'lifeline-emergency-alerts';
export const EMERGENCY_ALERT_UPDATE_EVENT = 'lifeline-emergency-alerts-updated';

export function getEmergencyAlerts() {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(EMERGENCY_ALERT_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as EmergencyAlert[];
  } catch {
    return [];
  }
}

export function publishEmergencyAlert(alert: Omit<EmergencyAlert, 'id' | 'time' | 'status'>) {
  const nextAlert: EmergencyAlert = {
    ...alert,
    id: `alert-${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'New',
  };
  const alerts = [nextAlert, ...getEmergencyAlerts()].slice(0, 20);

  window.localStorage.setItem(EMERGENCY_ALERT_STORAGE_KEY, JSON.stringify(alerts));
  window.dispatchEvent(new Event(EMERGENCY_ALERT_UPDATE_EVENT));

  return nextAlert;
}

export function deleteEmergencyAlert(id: string) {
  const next = getEmergencyAlerts().filter((a) => a.id !== id);
  window.localStorage.setItem(EMERGENCY_ALERT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EMERGENCY_ALERT_UPDATE_EVENT));
}

export function updateEmergencyAlert(id: string, patch: Partial<EmergencyAlert>) {
  const alerts = getEmergencyAlerts();
  const next = alerts.map((a) => (a.id === id ? { ...a, ...patch } : a));
  window.localStorage.setItem(EMERGENCY_ALERT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EMERGENCY_ALERT_UPDATE_EVENT));
  return next.find((a) => a.id === id) || null;
}
