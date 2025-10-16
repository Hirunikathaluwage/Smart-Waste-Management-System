// Role constants - avoiding magic strings
export const ROLES = {
  RESIDENT: 'Resident',
  WORKER: 'Worker',
  ADMIN: 'Admin',
  BUSINESS: 'Business'
};

// Route paths for each role
export const ROLE_ROUTES = {
  [ROLES.RESIDENT]: '/resident/dashboard',
  [ROLES.WORKER]: '/worker/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.BUSINESS]: '/business/dashboard'
};

// User types for forms (lowercase)
export const USER_TYPES = {
  RESIDENT: 'resident',
  WORKER: 'worker',
  ADMIN: 'admin',
  BUSINESS: 'business'
};

// Map form user types to backend roles (strings that match enum values)
export const USER_TYPE_TO_ROLE = {
  [USER_TYPES.RESIDENT]: ROLES.RESIDENT,
  [USER_TYPES.WORKER]: ROLES.WORKER,
  [USER_TYPES.ADMIN]: ROLES.ADMIN,
  [USER_TYPES.BUSINESS]: ROLES.BUSINESS
};

