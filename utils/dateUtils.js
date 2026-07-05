import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes, isToday, isYesterday } from 'date-fns';

export const dateUtils = {
  format: (date, formatStr = 'MMM d, yyyy') => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  },

  formatTime: (date, formatStr = 'h:mm a') => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  },

  formatDateTime: (date, formatStr = 'MMM d, yyyy h:mm a') => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  },

  formatRelative: (date) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? parseISO(date) : date;
    
    if (isToday(d)) {
      return `Today at ${format(d, 'h:mm a')}`;
    }
    if (isYesterday(d)) {
      return `Yesterday at ${format(d, 'h:mm a')}`;
    }
    
    const daysAgo = differenceInDays(new Date(), d);
    if (daysAgo < 7) {
      return `${daysAgo} days ago`;
    }
    
    return format(d, 'MMM d, yyyy');
  },

  isToday: (date) => {
    if (!date) return false;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isToday(d);
  },

  isYesterday: (date) => {
    if (!date) return false;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isYesterday(d);
  },

  differenceInDays: (date) => {
    if (!date) return 0;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(new Date(), d);
  },

  differenceInHours: (date) => {
    if (!date) return 0;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInHours(new Date(), d);
  },

  differenceInMinutes: (date) => {
    if (!date) return 0;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInMinutes(new Date(), d);
  },

  getDateRange: (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  },

  getMonthRange: () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  },

  getYearRange: () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), 0, 1);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  },
};

export default dateUtils;