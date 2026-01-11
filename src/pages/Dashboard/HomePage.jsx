import GraphImage from '../../assets/landing/graph.svg'
import Chart from 'react-apexcharts';
import { FiCalendar, FiSettings } from 'react-icons/fi';
import { IoIosSend } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaArrowRight, FaUser } from "react-icons/fa6";
import { MdCompareArrows } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
import { FaLink } from "react-icons/fa";
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { plaidAPI, authAPI } from '../../services/api';
import { usePlaidLink } from 'react-plaid-link';

const HomePage = () => {
  const [accountData, setAccountData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [cardDetails, setCardDetails] = useState([]);
  const [reserves, setReserves] = useState({ totalReserves: 0, accounts: [] });
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  
  // User profile state
  const [userProfile, setUserProfile] = useState(null);
  const [userCard, setUserCard] = useState(null);
  
  // Transfer state
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAccount, setTransferAccount] = useState('');
  const [sendingTransfer, setSendingTransfer] = useState(false);
  
  // Quick Transfer state
  const [quickTransferAmount, setQuickTransferAmount] = useState('');
  const [recentContacts, setRecentContacts] = useState([]);

  // Currency conversion state
  const [usdAmount, setUsdAmount] = useState('');
  const [eurAmount, setEurAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Plaid Link state
  const [linkToken, setLinkToken] = useState(null);
  const [isLinked, setIsLinked] = useState(false);
  const [linkingAccount, setLinkingAccount] = useState(false);
  const [unlinkingAccount, setUnlinkingAccount] = useState(false);

  // Expense data state
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
    fetchUserProfile();
    fetchExchangeRate();
    generateLinkToken();
  }, []);

  // Generate Plaid Link token
  const generateLinkToken = async () => {
    try {
      const response = await plaidAPI.createLinkToken();
      if (response.linkToken) {
        setLinkToken(response.linkToken);
      }
    } catch (error) {
      console.error('Error generating link token:', error);
    }
  };

  // Handle successful Plaid Link
  const onPlaidSuccess = useCallback(async (publicToken, metadata) => {
    setLinkingAccount(true);
    try {
      const response = await plaidAPI.exchangePublicToken(publicToken);
      if (response && !response.error) {
        toast.success('Bank account linked successfully!');
        setIsLinked(true);
        fetchDashboardData(); // Refresh data after linking
      } else {
        toast.error(response.error || 'Failed to link account');
      }
    } catch (error) {
      console.error('Error exchanging token:', error);
      toast.error('Failed to link bank account');
    } finally {
      setLinkingAccount(false);
    }
  }, []);

  // Plaid Link configuration
  const plaidConfig = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid Link error:', err);
      }
    },
  };

  const { open: openPlaidLink, ready: plaidReady } = usePlaidLink(plaidConfig);

  // Fetch real-time exchange rate
  const fetchExchangeRate = async () => {
    setRateLoading(true);
    try {
      // Using exchangerate-api.com free tier (no API key needed for basic use)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data && data.rates && data.rates.EUR) {
        setExchangeRate(data.rates.EUR);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Fallback rate if API fails
      setExchangeRate(0.92);
    } finally {
      setRateLoading(false);
    }
  };

  // Handle USD input change and convert to EUR
  const handleUsdChange = (value) => {
    setUsdAmount(value);
    if (value && exchangeRate) {
      const converted = (parseFloat(value) * exchangeRate).toFixed(2);
      setEurAmount(converted);
    } else {
      setEurAmount('');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response && !response.error) {
        // Merge user and profile data for easier access
        setUserProfile({
          ...response.profile,
          cardHolderName: response.user?.cardHolderName,
          businessNameOnCard: response.user?.businessNameOnCard
        });
        setUserCard(response.card);
        
        // Extract recent contacts from transactions if available
        if (response.user) {
          // You could fetch recent transfer recipients here
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [transactionsRes, cardRes, reservesRes, summaryRes] = await Promise.all([
        plaidAPI.getTransactions().catch(() => ({ transactions: [] })),
        plaidAPI.getCardDetails().catch(() => ({ cards: [] })),
        plaidAPI.getReserves().catch(() => ({ totalReserves: 0, accounts: [] })),
        plaidAPI.getTransactionSummary().catch(() => ({ transactions: [], totalAmount: 0 }))
      ]);

      // Check if user has linked accounts
      if (reservesRes.accounts && reservesRes.accounts.length > 0) {
        setIsLinked(true);
      }

      // Process transactions for display
      if (transactionsRes.transactions && transactionsRes.transactions.length > 0) {
        const formattedTransactions = transactionsRes.transactions.slice(0, 5).map((t, index) => ({
          id: t.transaction_id || index,
          name: t.merchant_name || t.name || 'Transaction',
          date: new Date(t.date).toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          amount: t.amount < 0 ? `+$${Math.abs(t.amount).toFixed(2)}` : `-$${t.amount.toFixed(2)}`,
          isExpense: t.amount > 0
        }));
        setTransactions(formattedTransactions);
      }

      // Process card details
      if (cardRes.cards) {
        setCardDetails(cardRes.cards);
      }

      // Process reserves/balance
      if (reservesRes) {
        setReserves(reservesRes);
      }

      // Process activity data for chart
      if (summaryRes.transactions && summaryRes.transactions.length > 0) {
        const monthlyData = processMonthlyData(summaryRes.transactions);
        setActivityData(monthlyData);
        
        // Process expense data (only expenses, not income)
        const expenseMonthlyData = processExpenseData(summaryRes.transactions);
        setExpenseData(expenseMonthlyData.data);
        setTotalExpense(expenseMonthlyData.total);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep default/empty state on error
    } finally {
      setLoading(false);
    }
  };

  // Process transactions into monthly totals for chart
  const processMonthlyData = (transactions) => {
    const monthlyTotals = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    months.forEach(month => { monthlyTotals[month] = 0; });
    
    // Sum transactions by month
    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = months[date.getMonth()];
      monthlyTotals[month] += Math.abs(t.amount);
    });
    
    return months.map(month => Math.round(monthlyTotals[month] * 100) / 100);
  };

  // Process expense transactions (only positive amounts which are debits/expenses in Plaid)
  const processExpenseData = (transactions) => {
    const monthlyExpenses = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    months.forEach(month => { monthlyExpenses[month] = 0; });
    
    let totalExpenses = 0;
    
    // Sum only expense transactions (positive amounts in Plaid are debits)
    transactions.forEach(t => {
      if (t.amount > 0) { // Positive = expense/debit
        const date = new Date(t.date);
        const month = months[date.getMonth()];
        monthlyExpenses[month] += t.amount;
        totalExpenses += t.amount;
      }
    });
    
    // Get last 5 months for display
    const currentMonth = new Date().getMonth();
    const last5Months = [];
    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last5Months.push({
        month: months[monthIndex],
        amount: Math.round(monthlyExpenses[months[monthIndex]] * 100) / 100
      });
    }
    
    return { data: last5Months, total: Math.round(totalExpenses * 100) / 100 };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!transferAccount || !transferAmount) {
      toast.error('Please enter account number and amount');
      return;
    }
    
    setSendingTransfer(true);
    try {
      const response = await plaidAPI.initiateTransfer(transferAccount, parseFloat(transferAmount));
      if (response && !response.error) {
        toast.success('Transfer initiated successfully!');
        setTransferAccount('');
        setTransferAmount('');
        fetchDashboardData(); // Refresh data
      } else {
        toast.error(response.error || 'Transfer failed');
      }
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    } finally {
      setSendingTransfer(false);
    }
  };

  // Handle quick transfer
  const handleQuickTransfer = async () => {
    if (!quickTransferAmount) {
      toast.error('Please enter an amount');
      return;
    }

    if (!isLinked || !reserves.accounts?.length) {
      toast.error('Please link a bank account first');
      return;
    }
    
    setSendingTransfer(true);
    try {
      const response = await plaidAPI.quickTransfer(parseFloat(quickTransferAmount));
      if (response && response.success) {
        toast.success(`Transfer of $${quickTransferAmount} initiated successfully!`);
        setQuickTransferAmount('');
        fetchDashboardData(); // Refresh data
      } else {
        toast.error(response.error || 'Transfer failed');
      }
    } catch (error) {
      toast.error('Transfer failed: ' + error.message);
    } finally {
      setSendingTransfer(false);
    }
  };

  // Handle unlink bank account
  const handleUnlinkAccount = async () => {
    if (!confirm('Are you sure you want to unlink your bank account?')) {
      return;
    }

    setUnlinkingAccount(true);
    try {
      const response = await plaidAPI.unlinkAccount();
      if (response && response.success) {
        toast.success('Bank account unlinked successfully!');
        setIsLinked(false);
        setReserves({ totalReserves: 0, accounts: [] });
        setTransactions([]);
        setExpenseData([]);
        setTotalExpense(0);
        setActivityData([]);
        generateLinkToken(); // Generate new link token for re-linking
      } else {
        toast.error(response.error || 'Failed to unlink account');
      }
    } catch (error) {
      toast.error('Failed to unlink account');
    } finally {
      setUnlinkingAccount(false);
    }
  };

  // Format card number for display
  const formatCardNumber = (last4, full = false) => {
    if (full && userCard) {
      return `**** **** **** ${last4 || '****'}`;
    }
    return last4 ? `•••• ${last4}` : '•••• ••••';
  };

  // Format expiry date
  const formatExpiry = (month, year) => {
    if (month && year) {
      return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
    }
    return 'MM/YY';
  };

  const series = [
    {
      name: 'Activity',
      data: activityData.length > 0 ? activityData : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const options = {
    chart: {
      id: 'activity-chart',
      toolbar: { show: false },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value / 1000}k`,
      },
    },
    colors: ['#6366F1'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    grid: {
      borderColor: '#E0E0E0',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        gradientToColors: ['#A78BFA'],
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
  };

  // Default transactions if no data loaded
  const defaultTransactions = [
    {
      id: 1,
      name: 'No transactions yet',
      date: '-',
      amount: '$0.00',
      isExpense: false,
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : defaultTransactions;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center m-2.5 sm:m-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-gray text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (


    <div className="flex-1 overflow-x-auto relative m-2.5 sm:m-5">



      <div className='flex flex-col lg:flex-row items-stretch gap-3 sm:gap-5 w-full'>


        {/* Virtual Card - Shows real user data */}
        <div className='w-full lg:w-auto lg:min-w-[20rem] flex-shrink-0'>
          <div className="w-full lg:w-[20rem] h-[11rem] sm:h-[12.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            
            {/* Card content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/70">Virtual Card</p>
                  <p className="text-sm font-medium">Helvita</p>
                </div>
                <div className="flex space-x-1">
                  <div className="w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
                  <div className="w-8 h-8 bg-yellow-400 rounded-full -ml-4 opacity-80"></div>
                </div>
              </div>
              
              <div>
                <p className="text-lg tracking-widest font-mono">
                  {userCard ? `**** **** **** ${userCard.last4}` : '**** **** **** ****'}
                </p>
              </div>
              
              <div className="flex justify-between items-end flex-wrap gap-2">
                <div>
                  <p className="text-xs text-white/70">Card Holder</p>
                  <p className="text-xs sm:text-sm font-medium uppercase truncate max-w-[100px] sm:max-w-none">
                    {userCard?.cardholderName || userProfile?.cardHolderName || userProfile?.nameOnCard || userProfile?.fullName || 'CARD HOLDER'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Expires</p>
                  <p className="text-xs sm:text-sm font-medium">
                    {userCard ? formatExpiry(userCard.expMonth, userCard.expYear) : 'MM/YY'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">Status</p>
                  <p className="text-xs font-medium capitalize">
                    {userCard?.status || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1 min-w-0 w-full bg-white rounded-xl p-4 sm:p-5'>
          <p className='text-gray text-sm sm:text-base'>Available balance</p>
          <h1 className='text-2xl sm:text-3xl font-semibold mt-1 sm:mt-2'>{formatCurrency(reserves.totalReserves)}</h1>

          <div className='mt-3 sm:mt-5 bg-[#F4F6F9] p-3 rounded-md'>
            <h1 className='font-semibold text-sm sm:text-base'>Accounts</h1>
            {reserves.accounts && reserves.accounts.length > 0 ? (
              reserves.accounts.slice(0, 2).map((account, index) => (
                <div key={index} className='flex justify-between items-center mt-2'>
                  <p className='text-gray text-sm'>{account.name || 'Account'}</p>
                  <p className='font-medium text-sm'>{formatCurrency(account.availableBalance)}</p>
                </div>
              ))
            ) : (
              <div className='flex justify-between items-center mt-2'>
                <p className='text-gray text-sm'>No accounts linked</p>
                <p className='font-medium text-sm'>$0.00</p>
              </div>
            )}
          </div>

        </div>

        <div className='flex-1 min-w-0 w-full bg-white rounded-xl p-4 sm:p-5'>
          <p className='text-[#2A2F47] text-sm sm:text-base'>My expense</p>
          <div className='flex items-center gap-2 mt-2'>
            <div className='w-8 h-8 rounded-full bg-[#2A2F47] flex items-center justify-center'>
              <span className='text-white text-xs'>💰</span>
            </div>
            <span className='text-lg font-semibold'>{formatCurrency(totalExpense)}</span>
          </div>
          <div className='flex justify-center items-end gap-2 mt-4 h-[8rem] sm:h-[10rem]'>
            {expenseData.length > 0 ? (
              expenseData.map((item, index) => {
                const maxAmount = Math.max(...expenseData.map(d => d.amount), 1);
                const heightPercent = (item.amount / maxAmount) * 100;
                const isCurrentMonth = index === expenseData.length - 1;
                return (
                  <div key={item.month} className='flex flex-col items-center gap-1'>
                    <div 
                      className={`w-6 sm:w-8 rounded-t-md ${isCurrentMonth ? 'bg-blue' : 'bg-[#E8EAED]'}`}
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      title={formatCurrency(item.amount)}
                    ></div>
                    <span className='text-xs text-gray-500'>{item.month}</span>
                  </div>
                );
              })
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                <p className='text-sm'>No expense data</p>
                <p className='text-xs'>Link a bank to see expenses</p>
              </div>
            )}
          </div>
        </div>



      </div>


      <div className='flex flex-col lg:flex-row items-stretch gap-3 sm:gap-5 w-full mt-5 sm:mt-10'>
        <div className='flex-1 min-w-0 bg-white rounded-xl p-4 sm:p-5'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Activity</h2>
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <FiCalendar />
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
          <Chart options={options} series={series} type="area" height={250} />
        </div>

        <div className='w-full lg:w-auto lg:min-w-[22rem] bg-white rounded-xl p-4 sm:p-5'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Transactions</h2>
            <FiSettings className="text-gray-600 cursor-pointer" onClick={fetchDashboardData} />
          </div>
          <ul className="space-y-3">
            {displayTransactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiCalendar className={transaction.isExpense ? "text-red-500" : "text-green-500"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{transaction.name}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${transaction.isExpense ? 'text-red-500' : 'text-green-500'}`}>
                  {transaction.amount}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 w-full mt-5 sm:mt-10'>


        <div className='w-full bg-white rounded-xl p-4 sm:p-5'>

          <div className='flex justify-between items-center'>

            <div className='flex items-center gap-x-2 sm:gap-x-3'>
              <IoIosSend className='text-blue' />
              <p className='text-base sm:text-lg font-semibold'>Transfer</p>
            </div>

            <HiDotsHorizontal className='text-blue cursor-pointer' onClick={fetchDashboardData} />

          </div>

          <div className='flex flex-col gap-y-2 mt-3'>
            <input 
              type="text" 
              value={transferAccount}
              onChange={(e) => setTransferAccount(e.target.value)}
              className='border border-[#AEB1B4] px-3 py-2 rounded-md outline-none w-full' 
              placeholder='Enter account number' 
            />
            <div className='flex justify-between items-center gap-x-2'>
              <input 
                type="number" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className='border border-[#AEB1B4] px-3 py-2 rounded-md outline-none flex-1' 
                placeholder='Amount ($)' 
              />
              <button 
                onClick={handleTransfer}
                disabled={sendingTransfer}
                className='w-10 h-10 rounded-full bg-blue flex justify-center items-center text-white hover:bg-blue/90 disabled:opacity-50'
              >
                {sendingTransfer ? '...' : <FaArrowRight />}
              </button>
            </div>
          </div>

          <p className='mt-2 text-gray text-sm'>
            {reserves.accounts?.length > 0 
              ? `Transfer from ${reserves.accounts[0]?.name || 'your account'}` 
              : 'Link a bank account to enable transfers'}
          </p>

          {/* Link Bank Account Button */}
          {!isLinked && reserves.accounts?.length === 0 && (
            <button
              onClick={() => plaidReady && openPlaidLink()}
              disabled={!plaidReady || linkingAccount}
              className='w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <FaLink />
              {linkingAccount ? 'Linking...' : 'Link Bank Account'}
            </button>
          )}

          {/* Unlink Bank Account Button */}
          {isLinked && reserves.accounts?.length > 0 && (
            <button
              onClick={handleUnlinkAccount}
              disabled={unlinkingAccount}
              className='w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {unlinkingAccount ? 'Unlinking...' : 'Unlink Bank Account'}
            </button>
          )}

        </div>

        <div className='w-full bg-white rounded-xl p-4 sm:p-5'>

          <div className='flex justify-between items-center'>

            <div className='flex items-center gap-x-2 sm:gap-x-3'>
              <CgArrowsExchange className='text-blue' />
              <p className='text-base sm:text-lg font-semibold'>Conversion</p>
            </div>

            <HiDotsHorizontal className='text-blue' />

          </div>

          <div className='flex justify-between items-center mt-3 gap-x-3'>
            <div className='flex-1'>
              <label className='text-xs text-gray'>USD</label>
              <input 
                type="number" 
                value={usdAmount}
                onChange={(e) => handleUsdChange(e.target.value)}
                className='w-full border border-[#AEB1B4] px-3 py-2 rounded-md outline-none' 
                placeholder='100.00' 
              />
            </div>
            <MdCompareArrows className='text-blue text-xl' />
            <div className='flex-1'>
              <label className='text-xs text-gray'>EUR</label>
              <input 
                type="number" 
                value={eurAmount}
                className='w-full border border-[#AEB1B4] px-3 py-2 rounded-md outline-none bg-gray-50' 
                placeholder='0.00' 
                readOnly 
              />
            </div>
          </div>

          <div className='flex justify-between items-center mt-2'>
            <p className='text-gray text-sm'>
              {rateLoading ? 'Loading rate...' : `Rate: 1 USD = ${exchangeRate?.toFixed(4) || '---'} EUR`}
            </p>
            <button 
              onClick={fetchExchangeRate}
              className='text-xs text-blue hover:underline'
              disabled={rateLoading}
            >
              {rateLoading ? 'Updating...' : 'Refresh'}
            </button>
          </div>

        </div>

        <div className='w-full bg-white rounded-xl p-4 sm:p-5 md:col-span-2 xl:col-span-1'>
          <h1 className='font-medium text-sm sm:text-base'>Quick Transfer</h1>
          
          {/* Recent contacts/accounts */}
          <div className='flex items-center mt-2 gap-x-2 overflow-x-auto py-2'>
            {reserves.accounts && reserves.accounts.length > 0 ? (
              reserves.accounts.slice(0, 5).map((account, index) => (
                <div 
                  key={index} 
                  className='flex flex-col items-center cursor-pointer hover:opacity-80'
                  onClick={() => setTransferAccount(account.accountId || '')}
                >
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium'>
                    {account.name?.charAt(0) || 'A'}
                  </div>
                  <p className='text-xs text-gray mt-1 truncate max-w-[3rem]'>{account.name?.split(' ')[0] || 'Acc'}</p>
                </div>
              ))
            ) : (
              // Placeholder when no accounts
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='flex flex-col items-center'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400'>
                    <FaUser className='text-sm' />
                  </div>
                  <p className='text-xs text-gray mt-1'>---</p>
                </div>
              ))
            )}
          </div>
          
          <input 
            type="number" 
            value={quickTransferAmount}
            onChange={(e) => setQuickTransferAmount(e.target.value)}
            className='border border-[#AEB1B4] px-3 py-2 rounded-md outline-none w-full mt-3' 
            placeholder='Enter amount ($)' 
          />

          <div className='flex items-center gap-x-2 mt-2'>
            <button 
              className='flex-1 border border-blue py-3 rounded-lg text-blue hover:bg-blue/5'
              onClick={() => {
                if (quickTransferAmount) {
                  toast.success('Draft saved!');
                } else {
                  toast.error('Enter an amount first');
                }
              }}
            >
              Save as draft
            </button>
            <button 
              className='flex-1 bg-blue text-white py-3 rounded-lg hover:bg-blue/90 disabled:opacity-50'
              disabled={sendingTransfer}
              onClick={handleQuickTransfer}
            >
              {sendingTransfer ? 'Sending...' : 'Send money'}
            </button>
          </div>
        </div>




      </div>




    </div >
  );
};

export default HomePage;