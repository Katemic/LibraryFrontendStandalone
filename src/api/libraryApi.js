import { request } from './http';

export const libraryApi = {
  login: (credentials) => request('/api/Auth/login', { method: 'POST', body: credentials }),
  register: (loaner) => request('/api/Auth/register', { method: 'POST', body: loaner }),
  logout: () => request('/api/Auth/logout', { method: 'POST' }),

  getItems: () => request('/api/Items'),
  getItem: (id) => request(`/api/Items/${id}`),
  getInventoryByItem: (itemId) => request(`/api/Inventory/item/${itemId}`),

  createLoan: ({ loanerId, inventoryId }) =>
    request('/api/Loans', { method: 'POST', body: { loanerId, inventoryId } }),
  getMyLoans: (includeReturned = false) =>
    request(`/api/Loans/my-loans?includeReturned=${includeReturned}`),
  returnLoan: (loanId) => request(`/api/Loans/${loanId}/return`, { method: 'PUT' }),

  createReservation: (itemId) => request('/api/Reservation', { method: 'POST', body: { itemId } }),
  getMyReservations: () => request('/api/Reservation/MyReservations'),
  cancelReservation: (itemId) => request(`/api/Reservation/${itemId}`, { method: 'DELETE' }),

  getFinesByLoaner: (loanerId) => request(`/api/Fines/loaner/${loanerId}`),
  payFine: (fineId) => request(`/api/Fines/${fineId}/pay`, { method: 'PUT' }),

  resetTestDatabase: () => request('/api/test/reset-database', { method: 'POST' }),
};
