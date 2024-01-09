import { DEFAULT_COPY_SUCCESS_ALERT } from 'shared/lib/const'
import { alerts } from './alerts'
import { Zoom } from 'react-toastify'
import moment from 'moment'

// Вывод сообщения об ошибке для запросов с responseType = blob
export async function alertUploadMessage(data: any) {
  let message = 'Непредвиденная ошибка'
  if (data instanceof Blob && data.type === 'application/json') {
    try {
      const text = await data.text()
      const json = JSON.parse(text)
      message = json.Message
    } catch {
      // empty
    }
  }
  alerts.error(message)
}

// запрещает ввод в инпут символом превышающий допустимое кол-во (maxNumbers)
export const preventMaxNumbers = (
  value: string,
  maxNumbers: number,
  callback: (v: string | number | undefined) => string | number | undefined,
) => {
  if (
    !String(value)
      .split('')
      .every((x) => '1234567890'.includes(x)) ||
    value.length > maxNumbers
  ) {
    return
  }
  callback(value)
}

export const showSuccessCopyAlert = (): void => {
  return alerts.success(DEFAULT_COPY_SUCCESS_ALERT, {
    position: 'bottom-center',
    hideProgressBar: true,
    autoClose: 500,
    transition: Zoom,
  })
}

export const getFirstDateOfMonth = (date: moment.Moment): moment.Moment => {
  return date.startOf('month')
}
export const getLastDateOfMonth = (date: moment.Moment): moment.Moment => {
  return date.endOf('month')
}
