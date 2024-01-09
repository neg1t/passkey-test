/* eslint-disable no-useless-escape */
import { Rule } from 'effector-forms'

const RequiredValidator: Rule<string | number | any> = {
  name: 'required',
  validator: (val) => {
    return val !== null ? val?.toString().length > 0 : val !== null
  },
  errorText: 'Поле обязательно',
}

const MinMaxValueValidator = (
  min: number,
  max: number,
): Rule<string | any | undefined> => {
  return {
    name: 'minMaxValue',
    validator: (val) => {
      let thatVal = val
      if (!thatVal) {
        return true
      }
      if (
        thatVal.includes(' ') ||
        thatVal.includes('-') ||
        thatVal.includes('_')
      ) {
        thatVal = thatVal
          .split('-')
          .join('')
          .split('_')
          .join('')
          .split(' ')
          .join('')
      }
      return thatVal.length >= min && thatVal.length <= max
    },
    errorText: 'Неверное количество символов',
  }
}

const RequiredArrayValidator: Rule<string> = {
  name: 'requiredArray',
  validator: (val) => {
    if (Array.isArray(val) && !val.length) {
      return false
    }
    return true
  },
  errorText: 'Поле обязательно',
}

const EmailValidator: Rule<string> = {
  name: 'email',
  validator: (val) => (val ? /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i.test(val) : true),
  errorText: 'Введенная электронная почта некорректна',
}

const PhoneValidator: Rule<string> = {
  name: 'phone',
  errorText: 'Введенный телефон некорректен',
  validator: (val) => {
    if (val === null || val === '') {
      return true
    }
    return /(?:([\d]{1,}?))??(?:([\d]{1,3}?))??(?:([\d]{1,3}?))??(?:([\d]{2}))??([\d]{2})$/gim.test(
      val,
    )
  },
}

const NumbersOnlyValidator: Rule<string | number> = {
  name: 'numbers',
  validator: (val) =>
    val
      .toString()
      ?.split('')
      .every((x) => '1234567890'.includes(x)),
  errorText: 'Введенное число некорректно',
}

const NotZero: Rule<string | number | undefined> = {
  name: 'not-zero',
  errorText: 'Не может быть 0',
  validator: (val) => {
    return val !== 0 && val !== '0'
  },
}

export const VALIDATORS = {
  RequiredValidator,
  MinMaxValueValidator,
  RequiredArrayValidator,
  EmailValidator,
  PhoneValidator,
  NumbersOnlyValidator,
  NotZero,
}
