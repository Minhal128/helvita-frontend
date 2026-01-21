import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { currencyAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import CurrencyTransactionModal from '../../components/dashboard/CurrencyTransactionModal';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';

const CurrencyAccountPage = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showTestActions, setShowTestActions] = useState(false);
  const [testAmount, setTestAmount] = useState('');
  const [bankInfo, setBankInfo] = useState(null);
  const [showBankActions, setShowBankActions] = useState(false);
  const [bankAmount, setBankAmount] = useState('');
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails();
      fetchTransactions(1);
      fetchBankInfo();
    }
  }, [accountId]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const response = await currencyAPI.getAccount(accountId);
      if (response.account) {
        setAccount(response.account);
      } else {
        toast.error('Account not found');
        navigate('/dashboard/currency');
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
      toast.error('Failed to load account details');
      navigate('/dashboard/currency');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1) => {
    try {
      setLoadingTransactions(true);
      const response = await currencyAPI.getTransactions(accountId, page, 20);
      if (response.transactions) {
        if (page === 1) {
          setTransactions(response.transactions);
        } else {
          setTransactions(prev => [...prev, ...response.transactions]);
        }
        setPagination(response.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleTestDeposit = async () => {
    if (!testAmount || parseFloat(testAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await currencyAPI.deposit(accountId, parseFloat(testAmount));
      if (response.transaction) {
        toast.success('Test deposit successful');
        setTestAmount('');
        fetchAccountDetails();
        fetchTransactions(1);
      } else {
        toast.error(response.error || 'Failed to process deposit');
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast.error('Failed to process deposit');
    }
  };

  const fetchBankInfo = async () => {
    try {
      const response = await currencyAPI.getBankInfo();
      setBankInfo(response);
    } catch (error) {
      console.error('Error fetching bank info:', error);
    }
  };

  const handleTestWithdrawal = async () => {
    if (!testAmount || parseFloat(testAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await currencyAPI.withdraw(accountId, parseFloat(testAmount));
      if (response.transaction) {
        toast.success('Test withdrawal successful');
        setTestAmount('');
        fetchAccountDetails();
        fetchTransactions(1);
      } else {
        toast.error(response.error || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Failed to process withdrawal');
    }
  };

  const handleFundFromBank = async () => {
    if (!bankAmount || parseFloat(bankAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await currencyAPI.fundFromBank(accountId, parseFloat(bankAmount));
      if (response.success) {
        toast.success('Funded from bank successfully');
        setBankAmount('');
        fetchAccountDetails();
        fetchTransactions(1);
      } else {
        toast.error(response.error || 'Failed to fund from bank');
      }
    } catch (error) {
      console.error('Error funding from bank:', error);
      toast.error('Failed to fund from bank');
    }
  };

  const handleWithdrawToBank = async () => {
    if (!bankAmount || parseFloat(bankAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await currencyAPI.withdrawToBank(accountId, parseFloat(bankAmount));
      if (response.success) {
        toast.success('Withdrawn to bank successfully');
        setBankAmount('');
        fetchAccountDetails();
        fetchTransactions(1);
      } else {
        toast.error(response.error || 'Failed to withdraw to bank');
      }
    } catch (error) {
      console.error('Error withdrawing to bank:', error);
      toast.error('Failed to withdraw to bank');
    }
  };

  const formatTransactionType = (type) => {
    const types = {
      deposit: { label: 'Deposit', icon: ArrowDownLeft, color: 'text-green-600' },
      withdrawal: { label: 'Withdrawal', icon: ArrowUpRight, color: 'text-red-600' },
      transfer_in: { label: 'Transfer In', icon: ArrowDownLeft, color: 'text-green-600' },
      transfer_out: { label: 'Transfer Out', icon: ArrowUpRight, color: 'text-red-600' },
      exchange: { label: 'Exchange', icon: RefreshCw, color: 'text-blue-600' },
      fee: { label: 'Fee', icon: ArrowUpRight, color: 'text-gray-600' }
    };
    return types[type] || { label: type, icon: RefreshCw, color: 'text-gray-600' };
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Account not found</p>
          <button
            onClick={() => navigate('/dashboard/currency')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Currency Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/currency')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {account.currency} Account
          </h1>
          <p className="text-gray-600">Account #{account.accountNumber}</p>
        </div>
      </div>

      {/* Account Summary Card */}
      <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {account.formattedBalance.symbol}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{account.currency} Account</h2>
              <p className="text-gray-500">#{account.accountNumber.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-500 text-sm mb-1">Current Balance</p>
          <p className="text-4xl font-bold text-gray-900">
            {showBalance ? account.formattedBalance.formatted : '••••••'}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Created {new Date(account.createdAt).toLocaleDateString()}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {account.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer_in">Transfers In</option>
                <option value="transfer_out">Transfers Out</option>
                <option value="exchange">Exchanges</option>
                <option value="fee">Fees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No transactions found</p>
              {searchTerm || filterType !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const typeInfo = formatTransactionType(transaction.type);
              const Icon = typeInfo.icon;
              
              return (
                <div
                  key={transaction._id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Icon className={typeInfo.color} size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{typeInfo.label}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()} • 
                          {transaction.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        ['deposit', 'transfer_in'].includes(transaction.type) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {showBalance ? transaction.formattedAmount.formatted : '••••••'}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Button */}
        {pagination.page < pagination.pages && (
          <div className="p-6 border-t text-center">
            <button
              onClick={() => fetchTransactions(currentPage + 1)}
              disabled={loadingTransactions}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingTransactions ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <CurrencyTransactionModal
        transaction={selectedTransaction}
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default CurrencyAccountPage;