import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'

import { alerts } from './alerts'
import { API_ROOT } from 'shared/config/const'
import { tokenModel } from 'entities/token'

const { events, stores } = tokenModel

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_ROOT,
  timeout: 120000,
})

const errorHandler = (error: AxiosError) => {
  if (error?.response?.status === 401) {
    const token = stores.$accessToken.getState()
    // Логаут на 401 только есть прошлые запросы уже не вызвали
    if (token.length !== 0) {
      events.logout()
    }
    return
  }

  if (!error.config.noAlert && error?.response?.data?.Message) {
    console.log(error?.response)
    alerts.error(error?.response?.data?.Message)
  }

  return Promise.reject(error?.response)
}

const resHandler = (response: AxiosResponse) => {
  const { data } = response

  if (data.message && data.message !== 'Успешно') {
    return Promise.reject(data.message)
  }

  return Promise.resolve(data)
}

const reqHandler = (config: AxiosRequestConfig) => {
  config.withCredentials = true
  config!.headers!['Authorization'] = 'Bearer ' + stores.$accessToken.getState()
  return config
}

axiosInstance.interceptors.request.use(reqHandler)
axiosInstance.interceptors.response.use(resHandler, errorHandler)

export default axiosInstance

/* 
  Пример запроса:
    
  interface User {
    id: string
    name: string
    age: number
    ...
  }
    
  const res: {view: User[]} = await axiosInstance.get(`/users`)

  res: {
    message: string
    view: User[]
    pagination?: number
  }
*/
