const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://helvitabackend.vercel.app/api";

// Full session first; the setup-only onboarding token (from OTP / pending-identity login) otherwise
const getHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("onboardingToken");
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

  clerkLogin: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/clerk-login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ token }),
    });
    return response.json();
  },

  requestEmailChange: async (currentEmail, newEmail) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-email/request`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ currentEmail, newEmail }),
    });
    return response.json();
  },

  confirmEmailChange: async (otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-email/confirm`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ otp }),
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
  me: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

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

  createSetupIntent: async () => {
    const response = await fetch(`${API_BASE_URL}/card/setup-intent`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  changePin: async (encryptedPin) => {
    const response = await fetch(`${API_BASE_URL}/card/change-pin`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ encryptedPin }),
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

  createInvoice: async ({ customerName, customerEmail, amount, description }) => {
    const response = await fetch(`${API_BASE_URL}/card/invoice`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ customerName, customerEmail, amount, description }),
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

  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/support/notifications`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  deleteNotification: async (id) => {
    const response = await fetch(`${API_BASE_URL}/support/notifications/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Currency APIs
export const currencyAPI = {
  // Get all currency accounts for user
  getAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/currency/accounts`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Create new currency account
  createAccount: async (currency) => {
    console.log('Creating currency account with:', { currency });
    const response = await fetch(`${API_BASE_URL}/currency/accounts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ currency: currency.toUpperCase() }),
    });
    const data = await response.json();
    console.log('Create account response:', data);
    return data;
  },

  // Get specific currency account
  getAccount: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/currency/accounts/${accountId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Get transaction history for account
  getTransactions: async (accountId, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await fetch(`${API_BASE_URL}/currency/accounts/${accountId}/transactions?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Get supported currencies
  getSupportedCurrencies: async () => {
    const response = await fetch(`${API_BASE_URL}/currency/supported`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Get dashboard data
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/currency/dashboard`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Test API connection
  test: async () => {
    const response = await fetch(`${API_BASE_URL}/currency/test`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Fund currency account from bank
  fundFromBank: async (accountId, amount, description = 'Bank transfer') => {
    const response = await fetch(`${API_BASE_URL}/currency/accounts/${accountId}/fund-from-bank`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, description }),
    });
    return response.json();
  },

  // Withdraw to bank
  withdrawToBank: async (accountId, amount, description = 'Bank withdrawal') => {
    const response = await fetch(`${API_BASE_URL}/currency/accounts/${accountId}/withdraw-to-bank`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, description }),
    });
    return response.json();
  },

  // Exchange between currencies
  exchangeCurrency: async (fromAccountId, toAccountId, amount) => {
    console.log('Exchanging currency:', { fromAccountId, toAccountId, amount });
    const response = await fetch(`${API_BASE_URL}/currency/exchange`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ fromAccountId, toAccountId, amount }),
    });
    const data = await response.json();
    console.log('Exchange response:', data);
    return data;
  },

  // Get exchange rate
  getExchangeRate: async (from, to, amount = 1) => {
    const params = new URLSearchParams({ from, to, amount: amount.toString() });
    const response = await fetch(`${API_BASE_URL}/currency/exchange-rate?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Get bank info
  getBankInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/currency/bank-info`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Sync USD account with Plaid balance
  syncWithPlaid: async () => {
    const response = await fetch(`${API_BASE_URL}/currency/sync-plaid`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },
};
