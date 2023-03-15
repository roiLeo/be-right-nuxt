import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'

dayjs.locale(fr)

export default function dateHook() {
  function toFormat(date: Date | string, format: string) {
    return dayjs(date).locale('fr').format(format)
  }

  function isSameDay(date1: Date | string, date2: Date | string) {
    return dayjs(date1).isSame(dayjs(date2), 'day')
  }

  function isBefore(date1: Date, date2: Date) {
    return dayjs(date1).isBefore(dayjs(date2))
  }

  return {
    toFormat,
    isBefore,
    isSameDay,
  }
}
