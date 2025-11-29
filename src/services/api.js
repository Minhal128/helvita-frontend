const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://helvitabackend.vercel.app/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Auth APIs
export const authAPI = {
  register: async (email, password, accountType) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, accountType }),
    });
    return response.json();
  },

  verifyOtp: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};

// Personal Account APIs
export const personalAPI = {
  investmentSetup: async (investmentType) => {
    const response = await fetch(`${API_BASE_URL}/personal/investment-setup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ investmentType }),
    });
    return response.json();
  },

  personalDetails: async (data) => {
    const response = await fetch(`${API_BASE_URL}/personal/details`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  bankSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/personal/bank-setup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  startIdentityVerification: async () => {
    const response = await fetch(`${API_BASE_URL}/personal/identity/start`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  createCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/personal/card/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Business Account APIs
export const businessAPI = {
  investmentSetup: async (investmentType) => {
    const response = await fetch(`${API_BASE_URL}/business/investment-setup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ investmentType }),
    });
    return response.json();
  },

  addressSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/business/address`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  companyDetails: async (data) => {
    const response = await fetch(`${API_BASE_URL}/business/company-details`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  startIdentityVerification: async () => {
    const response = await fetch(`${API_BASE_URL}/business/identity/start`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  createCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/business/card/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Admin APIs
export const adminAPI = {
  getPendingUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users/pending`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  approveUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/approve`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  rejectUser: async (userId, reason) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },
};

// Setup APIs
export const setupAPI = {
  personalSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/personal-setup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  businessSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/business-setup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  personalIdentity: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/personal-identity`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  businessIdentity: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/business-identity`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  createCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/create-card`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  acceptTerms: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/accept-terms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  adminApprove: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/admin-approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyDocumentStatus: async (email, verificationSessionId) => {
    const response = await fetch(`${API_BASE_URL}/setup/verify-document-status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, verificationSessionId }),
    });
    return response.json();
  },

  generateQRCode: async (email) => {
    const response = await fetch(`${API_BASE_URL}/setup/generate-qr-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
};
