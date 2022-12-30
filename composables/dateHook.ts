import dayjs from 'dayjs'

export default function dateHook() {
  function toFormat(date: Date | string, format: string) {
    return dayjs(date).locale('fr').format(format)
  }

  return {
    toFormat,
  }
}
