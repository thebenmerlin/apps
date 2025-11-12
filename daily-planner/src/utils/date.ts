import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(customParseFormat);

export const dateUtils = {
  now(): Dayjs {
    return dayjs();
  },

  today(): string {
    return dayjs().format('YYYY-MM-DD');
  },

  format(date: string | Date, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).format(format);
  },

  formatTime(time: string): string {
    return dayjs(time, 'HH:mm').format('h:mm A');
  },

  isToday(date: string): boolean {
    return dayjs(date).isToday();
  },

  isTomorrow(date: string): boolean {
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    return dayjs(date).format('YYYY-MM-DD') === tomorrow;
  },

  isPast(date: string): boolean {
    return dayjs(date).isBefore(dayjs(), 'day');
  },

  isFuture(date: string): boolean {
    return dayjs(date).isAfter(dayjs(), 'day');
  },

  addDays(date: string, days: number): string {
    return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
  },

  subtractDays(date: string, days: number): string {
    return dayjs(date).subtract(days, 'day').format('YYYY-MM-DD');
  },

  startOfWeek(date?: string): string {
    return dayjs(date).startOf('week').format('YYYY-MM-DD');
  },

  endOfWeek(date?: string): string {
    return dayjs(date).endOf('week').format('YYYY-MM-DD');
  },

  getWeekDays(date?: string): string[] {
    const start = dayjs(date).startOf('week');
    return Array.from({ length: 7 }, (_, i) =>
      start.add(i, 'day').format('YYYY-MM-DD')
    );
  },

  getDayName(date: string, short: boolean = false): string {
    return dayjs(date).format(short ? 'ddd' : 'dddd');
  },

  getRelativeDay(date: string): string {
    if (this.isToday(date)) return 'Today';
    if (this.isTomorrow(date)) return 'Tomorrow';
    if (this.isPast(date)) {
      const diff = dayjs().diff(dayjs(date), 'day');
      if (diff === 1) return 'Yesterday';
      return `${diff} days ago`;
    }
    return this.format(date, 'MMM D, YYYY');
  },

  combineDateAndTime(date: string, time: string): string {
    return dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toISOString();
  },

  isBetween(date: string, start: string, end: string): boolean {
    return dayjs(date).isBetween(start, end, 'day', '[]');
  },
};
