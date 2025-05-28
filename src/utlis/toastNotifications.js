// src/utils/toastNotifications.js

import { toast } from 'react-toastify';

export const showToast = (message, type = 'default', options = {}) => {
  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'warning':
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};
