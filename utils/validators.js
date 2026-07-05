// export const validators = {
//   // Email validation
//   email: (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) return { valid: false, message: 'Email is required' };
//     if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };
//     return { valid: true };
//   },

//   // Password validation
//   password: (password) => {
//     if (!password) return { valid: false, message: 'Password is required' };
//     if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
//     if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain an uppercase letter' };
//     if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain a lowercase letter' };
//     if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain a number' };
//     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//       return { valid: false, message: 'Password must contain a special character' };
//     }
//     return { valid: true };
//   },

//   // Phone validation
//   phone: (phone) => {
//     if (!phone) return { valid: true };
//     const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
//     if (!phoneRegex.test(phone)) return { valid: false, message: 'Invalid phone number format' };
//     return { valid: true };
//   },

//   // Required field
//   required: (value, fieldName = 'Field') => {
//     if (!value || value.trim() === '') {
//       return { valid: false, message: `${fieldName} is required` };
//     }
//     return { valid: true };
//   },

//   // Number validation
//   number: (value, min = null, max = null) => {
//     const num = parseFloat(value);
//     if (isNaN(num)) return { valid: false, message: 'Must be a valid number' };
//     if (min !== null && num < min) return { valid: false, message: `Must be at least ${min}` };
//     if (max !== null && num > max) return { valid: false, message: `Must be at most ${max}` };
//     return { valid: true };
//   },

//   // SKU validation
//   sku: (sku) => {
//     if (!sku) return { valid: false, message: 'SKU is required' };
//     if (!/^[A-Z0-9-]+$/.test(sku)) {
//       return { valid: false, message: 'SKU must contain only uppercase letters, numbers, and hyphens' };
//     }
//     return { valid: true };
//   },

//   // URL validation
//   url: (url) => {
//     if (!url) return { valid: true };
//     try {
//       new URL(url);
//       return { valid: true };
//     } catch {
//       return { valid: false, message: 'Invalid URL format' };
//     }
//   },

//   // Date validation
//   date: (date) => {
//     if (!date) return { valid: true };
//     const d = new Date(date);
//     if (isNaN(d.getTime())) return { valid: false, message: 'Invalid date format' };
//     return { valid: true };
//   },

//   // ZIP code validation
//   zipCode: (zip) => {
//     if (!zip) return { valid: true };
//     const zipRegex = /^\d{5}(-\d{4})?$/;
//     if (!zipRegex.test(zip)) return { valid: false, message: 'Invalid ZIP code format' };
//     return { valid: true };
//   }
// };

// // Validation function for forms
// export const validateForm = (data, rules) => {
//   const errors = {};

//   for (const [field, value] of Object.entries(data)) {
//     if (rules[field]) {
//       const rule = rules[field];
//       let result;

//       if (typeof rule === 'string') {
//         if (rule === 'required') {
//           result = validators.required(value, field);
//         } else if (rule === 'email') {
//           result = validators.email(value);
//         } else if (rule === 'password') {
//           result = validators.password(value);
//         } else if (rule === 'phone') {
//           result = validators.phone(value);
//         } else if (rule === 'sku') {
//           result = validators.sku(value);
//         }
//       } else if (Array.isArray(rule)) {
//         for (const r of rule) {
//           if (typeof r === 'function') {
//             result = r(value);
//           } else if (typeof r === 'string') {
//             if (r === 'required') result = validators.required(value, field);
//             else if (r === 'email') result = validators.email(value);
//             else if (r === 'phone') result = validators.phone(value);
//           }
//           if (result && !result.valid) break;
//         }
//       } else if (typeof rule === 'function') {
//         result = rule(value);
//       }

//       if (result && !result.valid) {
//         errors[field] = result.message;
//       }
//     }
//   }

//   return {
//     valid: Object.keys(errors).length === 0,
//     errors
//   };
// };






























export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { valid: false, message: 'Email is required' };
    if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };
    return { valid: true };
  },

  password: (password) => {
    if (!password) return { valid: false, message: 'Password is required' };
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
    if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain an uppercase letter' };
    if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain a lowercase letter' };
    if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain a number' };
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain a special character' };
    }
    return { valid: true };
  },

  phone: (phone) => {
    if (!phone) return { valid: true };
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone)) return { valid: false, message: 'Invalid phone number format' };
    return { valid: true };
  },

  required: (value, fieldName = 'Field') => {
    if (!value || value.trim() === '') {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true };
  },

  number: (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) return { valid: false, message: 'Must be a valid number' };
    if (min !== null && num < min) return { valid: false, message: `Must be at least ${min}` };
    if (max !== null && num > max) return { valid: false, message: `Must be at most ${max}` };
    return { valid: true };
  },

  sku: (sku) => {
    if (!sku) return { valid: false, message: 'SKU is required' };
    if (!/^[A-Z0-9-]+$/.test(sku)) {
      return { valid: false, message: 'SKU must contain only uppercase letters, numbers, and hyphens' };
    }
    return { valid: true };
  },

  url: (url) => {
    if (!url) return { valid: true };
    try {
      new URL(url);
      return { valid: true };
    } catch {
      return { valid: false, message: 'Invalid URL format' };
    }
  },

  date: (date) => {
    if (!date) return { valid: true };
    const d = new Date(date);
    if (isNaN(d.getTime())) return { valid: false, message: 'Invalid date format' };
    return { valid: true };
  },

  zipCode: (zip) => {
    if (!zip) return { valid: true };
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zip)) return { valid: false, message: 'Invalid ZIP code format' };
    return { valid: true };
  }
};

export const validateForm = (data, rules) => {
  const errors = {};

  for (const [field, value] of Object.entries(data)) {
    if (rules[field]) {
      const rule = rules[field];
      let result;

      if (typeof rule === 'string') {
        if (rule === 'required') {
          result = validators.required(value, field);
        } else if (rule === 'email') {
          result = validators.email(value);
        } else if (rule === 'password') {
          result = validators.password(value);
        } else if (rule === 'phone') {
          result = validators.phone(value);
        } else if (rule === 'sku') {
          result = validators.sku(value);
        }
      } else if (Array.isArray(rule)) {
        for (const r of rule) {
          if (typeof r === 'function') {
            result = r(value);
          } else if (typeof r === 'string') {
            if (r === 'required') result = validators.required(value, field);
            else if (r === 'email') result = validators.email(value);
            else if (r === 'phone') result = validators.phone(value);
          }
          if (result && !result.valid) break;
        }
      } else if (typeof rule === 'function') {
        result = rule(value);
      }

      if (result && !result.valid) {
        errors[field] = result.message;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};