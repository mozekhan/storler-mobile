// /**
//  * @typedef {Object} User
//  * @property {string} _id
//  * @property {string} firstName
//  * @property {string} lastName
//  * @property {string} email
//  * @property {string} phone
//  * @property {string} role
//  * @property {Object} storeId
//  * @property {string} storeId._id
//  * @property {string} storeId.name
//  * @property {string} storeId.code
//  * @property {string[]} permissions
//  * @property {boolean} isActive
//  * @property {Date} createdAt
//  * @property {Date} updatedAt
//  */

// /**
//  * @typedef {Object} AuthResponse
//  * @property {boolean} success
//  * @property {Object} data
//  * @property {User} data.user
//  * @property {string} data.accessToken
//  * @property {string} data.refreshToken
//  */

// /**
//  * @typedef {Object} LoginCredentials
//  * @property {string} email
//  * @property {string} password
//  */

// /**
//  * @typedef {Object} RegisterData
//  * @property {string} firstName
//  * @property {string} lastName
//  * @property {string} email
//  * @property {string} password
//  * @property {string} phone
//  * @property {string} role
//  * @property {string} storeId
//  */

// export const AuthTypes = {};













export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  storeId: {
    _id: string;
    name: string;
    code: string;
  };
  currentStoreId?: string;
  assignedStores?: string[];
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  storeId: string;
}