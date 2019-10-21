let registration: ServiceWorkerRegistration | null = null;

export async function init(): Promise<ServiceWorkerRegistration> {
  if (registration) return registration;
  if ('Notification' in window && Notification.permission !== 'granted') {
    const result = await Notification.requestPermission();
    if (result !== 'granted') throw new Error('Denied');
  }

  registration = await navigator.serviceWorker.ready;

  return registration;
}

export async function showNotification(
  title: string,
  options: NotificationOptions,
): Promise<void> {
  (await init()).showNotification(title, options);
}
