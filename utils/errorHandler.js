import { Alert } from 'react-native';

export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    const message = data?.message || data?.error || 'An error occurred';

    if (status === 401) {
      // Unauthorized - handle token refresh or logout
      return new AppError('Session expired. Please login again.', status);
    }

    if (status === 403) {
      return new AppError('You do not have permission to perform this action.', status);
    }

    if (status === 404) {
      return new AppError('Resource not found.', status);
    }

    if (status === 422) {
      // Validation error
      const details = data?.errors || data?.details || null;
      return new AppError(message, status, details);
    }

    return new AppError(message, status);
  } else if (error.request) {
    // The request was made but no response was received
    return new AppError('Network error. Please check your connection.', 0);
  } else {
    // Something happened in setting up the request that triggered an Error
    return new AppError(error.message || 'An unexpected error occurred.', 500);
  }
};

export const showErrorAlert = (error) => {
  const appError = error instanceof AppError ? error : handleApiError(error);
  let message = appError.message;

  if (appError.details) {
    if (typeof appError.details === 'object') {
      const details = Object.values(appError.details).flat().join('\n');
      if (details) {
        message += `\n\n${details}`;
      }
    } else if (typeof appError.details === 'string') {
      message += `\n\n${appError.details}`;
    }
  }

  Alert.alert('Error', message);
};

export const showSuccessAlert = (message, onPress = null) => {
  Alert.alert('Success', message, onPress ? [{ text: 'OK', onPress }] : [{ text: 'OK' }]);
};

export const showConfirmAlert = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]
  );
};

export default {
  AppError,
  handleApiError,
  showErrorAlert,
  showSuccessAlert,
  showConfirmAlert,
};