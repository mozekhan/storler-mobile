/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} data
 * @property {string} [message]
 * @property {string} [error]
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} data
 * @property {Object} pagination
 * @property {number} pagination.page
 * @property {number} pagination.limit
 * @property {number} pagination.total
 * @property {number} pagination.pages
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success
 * @property {string} error
 * @property {string} message
 * @property {Array} [details]
 */

/**
 * @typedef {Object} RequestConfig
 * @property {string} method
 * @property {string} url
 * @property {Object} [data]
 * @property {Object} [params]
 * @property {Object} [headers]
 * @property {number} [timeout]
 */

export const ApiTypes = {};