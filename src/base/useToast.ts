import { createApp, h, ref } from 'vue';
import ToastComponent from './Toast.vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastInstance {
  show: (msg: string, type?: ToastType, duration?: number) => void;
  hide: () => void;
}

let toastInstance: ToastInstance | null = null;

function getToastInstance(): ToastInstance {
  if (toastInstance) return toastInstance;

  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);

  const toastRef = ref<ToastInstance | null>(null);
  
  const app = createApp({
    setup: () => () => h(ToastComponent, { ref: toastRef }),
  });
  app.mount(mountNode);

  toastInstance = {
    show: (msg: string, type: ToastType = 'info', duration = 2000) => {
      setTimeout(() => (toastRef.value as any)?.show(msg, type, duration), 0);
    },
    hide: () => (toastRef.value as any)?.hide(),
  };

  return toastInstance;
}

export const toast = {
  success: (msg: string, duration = 2000) => getToastInstance().show(msg, 'success', duration),
  error: (msg: string, duration = 2000) => getToastInstance().show(msg, 'error', duration),
  warning: (msg: string, duration = 2000) => getToastInstance().show(msg, 'warning', duration),
  info: (msg: string, duration = 2000) => getToastInstance().show(msg, 'info', duration),
};

export default toast;
