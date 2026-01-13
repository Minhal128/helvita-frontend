const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth APIs
export const authAPI = {
  register: async (email, password, accountType, referralCode = null) => {
    const body = { email, password, accountType };
    if (referralCode) body.referralCode = referralCode;
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return response.json();
  },

  verifyOtp: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  verifyResetOtp: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return response.json();
  },

  googleLogin: async (credential) => {
    const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ credential }),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  getReferrals: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/referrals`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  deleteAccount: async (password = null) => {
    const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ password }),
    });
    return response.json();
  },
};

// Personal Account APIs
export const personalAPI = {
  investmentSetup: async (investmentType) => {
    const response = await fetch(`${API_BASE_URL}/personal/investment-setup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ investmentType }),
    });
    return response.json();
  },

  personalDetails: async (data) => {
    const response = await fetch(`${API_BASE_URL}/personal/details`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  bankSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/personal/bank-setup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  startIdentityVerification: async () => {
    const response = await fetch(`${API_BASE_URL}/personal/identity/start`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  createCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/personal/card/create`, {
      method: "POST",
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
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ investmentType }),
    });
    return response.json();
  },

  addressSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/business/address`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  companyDetails: async (data) => {
    const response = await fetch(`${API_BASE_URL}/business/company-details`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  startIdentityVerification: async () => {
    const response = await fetch(`${API_BASE_URL}/business/identity/start`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  createCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/business/card/create`, {
      method: "POST",
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
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  approveUser: async (userId) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}/approve`,
      {
        method: "POST",
        headers: getHeaders(),
      },
    );
    return response.json();
  },

  rejectUser: async (userId, reason) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}/reject`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      },
    );
    return response.json();
  },
};

// Setup APIs
export const setupAPI = {
  personalSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/personal-setup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  businessSetup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/business-setup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  personalIdentity: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/personal-identity`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  businessIdentity: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/business-identity`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  createCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/create-card`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  acceptTerms: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/accept-terms`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  adminApprove: async (data) => {
    const response = await fetch(`${API_BASE_URL}/setup/admin-approve`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyDocumentStatus: async (email, verificationSessionId) => {
    const response = await fetch(
      `${API_BASE_URL}/setup/verify-document-status`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, verificationSessionId }),
      },
    );
    return response.json();
  },

  generateQRCode: async (email) => {
    const response = await fetch(`${API_BASE_URL}/setup/generate-qr-code`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
};

// Plaid APIs
export const plaidAPI = {
  createLinkToken: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/create-link-token`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  exchangePublicToken: async (publicToken) => {
    const response = await fetch(
      `${API_BASE_URL}/plaid/exchange-public-token`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ publicToken }),
      },
    );
    return response.json();
  },

  getTransactions: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const response = await fetch(
      `${API_BASE_URL}/plaid/transactions?${params}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return response.json();
  },

  getAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/accounts`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  getTransactionSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/transaction-summary`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  getCardDetails: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/card-details`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  getReserves: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/reserves`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  initiateTransfer: async (accountNumber, amount, description = "") => {
    const response = await fetch(`${API_BASE_URL}/plaid/transfer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ accountNumber, amount, description }),
    });
    return response.json();
  },

  quickTransfer: async (amount, saveAsDraft = false) => {
    const response = await fetch(`${API_BASE_URL}/plaid/quick-transfer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, saveAsDraft }),
    });
    return response.json();
  },

  unlinkAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/unlink`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  getTransfers: async () => {
    const response = await fetch(`${API_BASE_URL}/plaid/transfers`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Card APIs
export const cardAPI = {
  addCard: async (cardData) => {
    const response = await fetch(`${API_BASE_URL}/card/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cardData),
    });
    return response.json();
  },

  getBillingHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/card/billing-history`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  blockCard: async () => {
    const response = await fetch(`${API_BASE_URL}/card/block`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  changePin: async () => {
    const response = await fetch(`${API_BASE_URL}/card/change-pin`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  requestCard: async (data) => {
    const response = await fetch(`${API_BASE_URL}/card/request`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  createInvoice: async (amount, description) => {
    const response = await fetch(`${API_BASE_URL}/card/invoice`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, description }),
    });
    return response.json();
  },

  listInvoices: async () => {
    const response = await fetch(`${API_BASE_URL}/card/invoices`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  makePayment: async (amount, paymentMethodId) => {
    const response = await fetch(`${API_BASE_URL}/card/payment`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, paymentMethodId }),
    });
    return response.json();
  },
};

// Support APIs
export const supportAPI = {
  sendMessage: async (message) => {
    const response = await fetch(`${API_BASE_URL}/support/message`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message }),
    });
    return response.json();
  },

  sendNotification: async (data) => {
    const response = await fetch(`${API_BASE_URL}/support/notification`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  sendReferralInvites: async (emails) => {
    const response = await fetch(`${API_BASE_URL}/support/referral-invite`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ emails }),
    });
    return response.json();
  },
};
