import { type ToastOptions, toast } from 'react-toastify'

export const alerts = {
  warn: (text: string, options?: ToastOptions) => {
    toast.warn(text, {
      theme: 'colored',
      position: options?.position || toast.POSITION.BOTTOM_RIGHT,
      ...options,
    })
  },
  error: (text: string, options?: ToastOptions) => {
    toast.error(text, {
      theme: 'colored',
      position: options?.position || toast.POSITION.BOTTOM_RIGHT,
      ...options,
    })
  },
  success: (text: string, options?: ToastOptions) => {
    toast.success(text, {
      theme: 'colored',
      position: options?.position || toast.POSITION.BOTTOM_RIGHT,
      ...options,
    })
  },
  default: (text: string, options?: ToastOptions) => {
    toast(text, {
      theme: 'colored',
      position: options?.position || toast.POSITION.BOTTOM_RIGHT,
      ...options,
    })
  },
  info: (text: string, options?: ToastOptions) => {
    toast.info(text, {
      theme: 'colored',
      position: options?.position || toast.POSITION.BOTTOM_RIGHT,
      ...options,
    })
  },
}
