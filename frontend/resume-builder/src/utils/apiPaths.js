const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
  BASE_URL,
  
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    PROFILE: `${BASE_URL}/api/auth/profile`,
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
  },

  RESUME: {
    CREATE: `${BASE_URL}/api/resume`,
    GET_ALL: `${BASE_URL}/api/resume`,
    GET_BY_ID: (id) => `${BASE_URL}/api/resume/${id}`,
    UPDATE: (id) => `${BASE_URL}/api/resume/${id}`,
    DELETE: (id) => `${BASE_URL}/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `${BASE_URL}/api/resume/${id}/upload-images`,
  },
};
