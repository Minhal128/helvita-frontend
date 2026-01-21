import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { currencyAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import {
  Plus,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Globe,
  RefreshCw,
} from "lucide-react";

const CurrencyPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [creating, setCreating] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeData, setExchangeData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    exchangeRate: null,
  });

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    // Fetch all data (no auto-sync - user manually deposits)
    await fetchDashboardData();
    fetchSupportedCurrencies();
    fetchBankInfo();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // First test if the currency API is available
      try {
        const testResponse = await currencyAPI.test();
        console.log("Currency API test:", testResponse);
      } catch (testError) {
        console.warn("Currency API not available:", testError);
        
        // Check if it's a database connection issue
        if (testError.message?.includes('Database') || testError.message?.includes('connection')) {
          toast.error('Database is connecting. Please wait a moment and refresh.');
        } else {
          toast.error('Multi-currency feature is temporarily unavailable.');
        }
        
        setAccounts([]);
        setRecentTransactions([]);
        setSummary({
          totalAccounts: 0,
          totalBalance: "0.00",
          activeCurrencies: [],
        });
        return;
      }

      const response = await currencyAPI.getDashboard();

      // Check if response has error
      if (response.error) {
        console.error("Dashboard API error:", response.error);
        
        if (response.error.includes('Database') || response.error.includes('connection')) {
          toast.error('Database is connecting. Please wait and try again.');
        } else {
          toast.error(response.error);
        }
        return;
      }

      if (response.accounts) {
        setAccounts(response.accounts);
        setRecentTransactions(response.recentTransactions || []);
        setSummary(response.summary || {});
      } else {
        // Handle case where no accounts exist yet
        setAccounts([]);
        setRecentTransactions([]);
        setSummary({
          totalAccounts: 0,
          totalBalance: "0.00",
          activeCurrencies: [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load currency accounts. Please try again.");
      // Set empty state on error
      setAccounts([]);
      setRecentTransactions([]);
      setSummary({
        totalAccounts: 0,
        totalBalance: "0.00",
        activeCurrencies: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportedCurrencies = async () => {
    try {
      const response = await currencyAPI.getSupportedCurrencies();
      if (response.currencies) {
        setSupportedCurrencies(response.currencies);
      }
    } catch (error) {
      console.error("Error fetching supported currencies:", error);
    }
  };

  const fetchBankInfo = async () => {
    try {
      const response = await currencyAPI.getBankInfo();
      setBankInfo(response);
    } catch (error) {
      console.error("Error fetching bank info:", error);
    }
  };

  const handleCreateAccount = async () => {
    if (!selectedCurrency) {
      toast.error("Please select a currency");
      return;
    }

    try {
      setCreating(true);
      const response = await currencyAPI.createAccount(selectedCurrency);
      
      if (response.account) {
        toast.success("Currency account created successfully");
        setShowCreateModal(false);
        setSelectedCurrency("");
        fetchDashboardData(); // Refresh data
      } else if (response.errors && response.errors.length > 0) {
        // Handle validation errors array from express-validator
        const errorMessage = response.errors.map(e => e.msg).join(', ');
        toast.error(errorMessage || 'Invalid currency selected');
      } else if (response.error) {
        // Handle specific error messages
        if (response.error.includes('Database connection') || response.error.includes('timeout')) {
          toast.error('Connection issue. Please check your internet and try again.');
        } else if (response.error.includes('already exists')) {
          toast.error('You already have an account for this currency.');
        } else {
          toast.error(response.error);
        }
      } else {
        toast.error("Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error("Failed to create currency account. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleExchange = async () => {
    if (
      !exchangeData.fromAccount ||
      !exchangeData.toAccount ||
      !exchangeData.amount
    ) {
      toast.error("Please fill all exchange fields");
      return;
    }

    if (parseFloat(exchangeData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const response = await currencyAPI.exchangeCurrency(
        exchangeData.fromAccount,
        exchangeData.toAccount,
        parseFloat(exchangeData.amount),
      );

      if (response.success || response.exchange) {
        toast.success("Currency exchange successful");
        setShowExchangeModal(false);
        setExchangeData({
          fromAccount: "",
          toAccount: "",
          amount: "",
          exchangeRate: null,
        });
        fetchDashboardData();
      } else if (response.errors && response.errors.length > 0) {
        // Handle validation errors array from express-validator
        const errorMessage = response.errors.map(e => e.msg).join(', ');
        toast.error(errorMessage);
      } else {
        toast.error(response.error || "Failed to exchange currency");
      }
    } catch (error) {
      console.error("Error exchanging currency:", error);
      toast.error("Failed to exchange currency");
    }
  };

  const fetchExchangeRate = useCallback(async () => {
    if (
      !exchangeData.fromAccount ||
      !exchangeData.toAccount ||
      !exchangeData.amount
    ) {
      return;
    }

    try {
      const fromAccount = accounts.find(
        (acc) => acc._id === exchangeData.fromAccount,
      );
      const toAccount = accounts.find(
        (acc) => acc._id === exchangeData.toAccount,
      );

      if (fromAccount && toAccount) {
        const response = await currencyAPI.getExchangeRate(
          fromAccount.currency,
          toAccount.currency,
          parseFloat(exchangeData.amount),
        );

        setExchangeData((prev) => ({ ...prev, exchangeRate: response }));
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }, [
    accounts,
    exchangeData.fromAccount,
    exchangeData.toAccount,
    exchangeData.amount,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExchangeRate();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchExchangeRate]);

  const getAvailableCurrencies = () => {
    const existingCurrencies = accounts.map((acc) => acc.currency);
    return supportedCurrencies.filter(
      (curr) => !existingCurrencies.includes(curr.code),
    );
  };

  const handleFundFromBank = async (accountId) => {
    const amount = prompt("Enter amount to fund from bank:");
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const response = await currencyAPI.fundFromBank(
        accountId,
        parseFloat(amount),
      );
      if (response.success) {
        toast.success("Funded from bank successfully");
        fetchDashboardData();
      } else {
        toast.error(response.error || "Failed to fund from bank");
      }
    } catch (error) {
      console.error("Error funding from bank:", error);
      toast.error("Failed to fund from bank");
    }
  };

  const handleWithdrawToBank = async (accountId) => {
    const amount = prompt("Enter amount to withdraw to bank:");
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const response = await currencyAPI.withdrawToBank(
        accountId,
        parseFloat(amount),
      );
      if (response.success) {
        toast.success("Withdrawn to bank successfully");
        fetchDashboardData();
      } else {
        toast.error(response.error || "Failed to withdraw to bank");
      }
    } catch (error) {
      console.error("Error withdrawing to bank:", error);
      toast.error("Failed to withdraw to bank");
    }
  };

  const formatTransactionType = (type) => {
    const types = {
      deposit: {
        label: "Deposit",
        icon: ArrowDownLeft,
        color: "text-green-600",
      },
      withdrawal: {
        label: "Withdrawal",
        icon: ArrowUpRight,
        color: "text-red-600",
      },
      transfer_in: {
        label: "Transfer In",
        icon: ArrowDownLeft,
        color: "text-green-600",
      },
      transfer_out: {
        label: "Transfer Out",
        icon: ArrowUpRight,
        color: "text-red-600",
      },
      exchange: { label: "Exchange", icon: RefreshCw, color: "text-blue-600" },
      fee: { label: "Fee", icon: ArrowUpRight, color: "text-gray-600" },
    };
    return (
      types[type] || { label: type, icon: RefreshCw, color: "text-gray-600" }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Multi-Currency Accounts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your global finances in one place
          </p>
          {bankInfo?.connected && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Bank connected: {bankInfo.accounts?.[0]?.name}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showBalances ? <EyeOff size={20} /> : <Eye size={20} />}
            {showBalances ? "Hide" : "Show"} Balances
          </button>
          {accounts.length >= 2 && (
            <button
              onClick={() => setShowExchangeModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw size={20} />
              Exchange
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
          >
            <Plus size={20} />
            Add Currency
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalAccounts || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Currencies</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.activeCurrencies?.length || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Globe className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {showBalances ? `$${summary.totalBalance || "0.00"}` : "••••••"}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Currency Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => navigate(`/dashboard/currency/${account._id}`)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {account.formattedBalance.symbol}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {account.currency}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Account #{account.accountNumber.slice(-6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {showBalances ? account.formattedBalance.formatted : "••••••"}
              </p>
            </div>

            {/* Deposit/Withdraw buttons for USD account when bank is connected */}
            {bankInfo?.connected && account.currency === 'USD' && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleFundFromBank(account._id)}
                  className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  + Deposit from Bank
                </button>
                <button
                  onClick={() => handleWithdrawToBank(account._id)}
                  className="flex-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                >
                  Withdraw to Bank
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Created {new Date(account.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  account.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {account.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Account Card */}
        {getAvailableCurrencies().length > 0 && (
          <div
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Plus className="text-gray-400 mb-2" size={32} />
            <p className="text-gray-600 font-medium">Add New Currency</p>
            <p className="text-sm text-gray-500 mt-1">
              {getAvailableCurrencies().length} available
            </p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Transactions
            </h2>
          </div>
          <div className="divide-y">
            {recentTransactions.slice(0, 5).map((transaction) => {
              const typeInfo = formatTransactionType(transaction.type);
              const Icon = typeInfo.icon;

              return (
                <div
                  key={transaction._id}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <Icon className={typeInfo.color} size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {typeInfo.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()} •
                        {transaction.currencyAccount?.currency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        ["deposit", "transfer_in"].includes(transaction.type)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {showBalances
                        ? transaction.formattedAmount.formatted
                        : "••••••"}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Currency Account
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a currency...</option>
                {getAvailableCurrencies().map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6 border-t pt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedCurrency("");
                }}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={creating || !selectedCurrency}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Exchange Currency
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Account
                </label>
                <select
                  value={exchangeData.fromAccount}
                  onChange={(e) =>
                    setExchangeData((prev) => ({
                      ...prev,
                      fromAccount: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select source account...</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.currency} - {account.formattedBalance.formatted}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Account
                </label>
                <select
                  value={exchangeData.toAccount}
                  onChange={(e) =>
                    setExchangeData((prev) => ({
                      ...prev,
                      toAccount: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select destination account...</option>
                  {accounts
                    .filter((acc) => acc._id !== exchangeData.fromAccount)
                    .map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.currency} -{" "}
                        {account.formattedBalance.formatted}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={exchangeData.amount}
                  onChange={(e) =>
                    setExchangeData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="Enter amount to exchange"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                  min="0.01"
                />
              </div>

              {exchangeData.exchangeRate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Exchange Preview
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Exchange Rate:</span>
                      <span>
                        {exchangeData.exchangeRate.exchangeRate.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>You will receive:</span>
                      <span className="font-medium">
                        {exchangeData.exchangeRate.convertedAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee (0.5%):</span>
                      <span>{exchangeData.exchangeRate.fee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowExchangeModal(false);
                  setExchangeData({
                    fromAccount: "",
                    toAccount: "",
                    amount: "",
                    exchangeRate: null,
                  });
                }}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleExchange}
                disabled={
                  !exchangeData.fromAccount ||
                  !exchangeData.toAccount ||
                  !exchangeData.amount
                }
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center font-medium"
              >
                Exchange Currency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
