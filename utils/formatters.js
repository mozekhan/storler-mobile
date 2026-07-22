export const formatCurrency = (amount, currency = 'NGN') => {
  if (amount === undefined || amount === null) return '₦0.00';

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date, format = 'MMM d, yyyy') => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

export const formatTime = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Format date to short string
 * Example: "Jan 15, 2024"
 */
export const formatDateShort = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};


export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';

  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';

  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (num) => {
  if (num === undefined || num === null) return '0%';
  return `${(num * 100).toFixed(1)}%`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const getStatusColor = (status) => {
  const colors = {
    'PENDING': '#f59e0b',
    'SALES_QR': '#3b82f6',
    'PAID': '#6366f1',
    'PAYMENT_QR': '#8b5cf6',
    'RELEASED': '#ec4899',
    'INVOICED': '#14b8a6',
    'COMPLETED': '#22c55e',
    'CANCELLED': '#ef4444',
    'REFUNDED': '#f97316'
  };
  return colors[status] || '#6b7280';
};

export const getStatusBadgeVariant = (status) => {
  const variants = {
    'PENDING': 'warning',
    'SALES_QR': 'info',
    'PAID': 'info',
    'PAYMENT_QR': 'info',
    'RELEASED': 'info',
    'INVOICED': 'info',
    'COMPLETED': 'success',
    'CANCELLED': 'error',
    'REFUNDED': 'error'
  };
  return variants[status] || 'default';
};