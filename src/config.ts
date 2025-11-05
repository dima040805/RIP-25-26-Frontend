export const API_BASE_URL = import.meta.env.PROD 
  ? 'http://172.20.10.3:8080/api'  // ДОБАВЬ /api в конец
  : '/api';