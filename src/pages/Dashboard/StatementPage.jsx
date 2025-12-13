import React, { useState, useEffect } from 'react'
import { HiDotsVertical, HiOutlineDotsVertical } from 'react-icons/hi'
import { IoIosCard } from 'react-icons/io'
import Chart from 'react-apexcharts';
import { FaCalendar } from 'react-icons/fa6';
import { FiDownload } from 'react-icons/fi';
import { LuCircleChevronDown, LuCircleChevronUp } from 'react-icons/lu';
import { plaidAPI, authAPI } from '../../services/api';

const StatementPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [accountData, setAccountData] = useState({
        holder: 'Loading...',
        accountNumber: '****-****-**',
        type: '-',
        currency: 'USD'
    });
    const [balance, setBalance] = useState(0);
    const [spent, setSpent] = useState(0);
    const [income, setIncome] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [monthlyData, setMonthlyData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatementData();
    }, []);

    const fetchStatementData = async () => {
        try {
            setLoading(true);
            const [profileRes, reserveRes, transRes] = await Promise.all([
                authAPI.getProfile().catch(() => ({ user: {}, profile: {} })),
                plaidAPI.getReserves().catch(() => ({ totalReserves: 0, accounts: [] })),
                plaidAPI.getTransactions().catch(() => ({ transactions: [] }))
            ]);

            // Set account holder info - use cardHolderName from user, or fullName from profile
            const user = profileRes?.user || {};
            const profile = profileRes?.profile || {};
            const holderName = user.cardHolderName || 
                              profile.fullName || 
                              profile.nameOnCard ||
                              user.businessNameOnCard ||
                              user.email?.split('@')[0] || 
                              'N/A';
            
            setAccountData({
                holder: holderName,
                accountNumber: reserveRes?.accounts?.[0]?.mask ? 
                    `****-****-${reserveRes.accounts[0].mask}` : '****-****-**',
                type: reserveRes?.accounts?.[0]?.subtype || reserveRes?.accounts?.[0]?.type || 'Checking',
                currency: reserveRes?.accounts?.[0]?.currency || reserveRes?.currency || 'USD'
            });

            // Set balance
            setBalance(reserveRes?.totalReserves || 0);

            // Process transactions
            const txns = transRes?.transactions || [];
            setTransactions(txns);
            setTransactionCount(txns.length);

            // Calculate income and expenses
            const totalSpent = txns.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
            const totalIncome = txns.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
            setSpent(totalSpent);
            setIncome(totalIncome);

            // Process monthly data for chart
            const monthlyTotals = new Array(9).fill(0);
            txns.forEach(t => {
                const date = new Date(t.date);
                const month = date.getMonth();
                if (month < 9) {
                    monthlyTotals[month] += Math.abs(t.amount);
                }
            });
            setMonthlyData(monthlyTotals);

        } catch (error) {
            console.error('Error fetching statement data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const series = [
        {
            name: 'Activity',
            data: monthlyData,
        },
    ];

    const options = {
        chart: {
            id: 'activity-chart',
            toolbar: { show: false },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        yaxis: {
            labels: {
                formatter: (value) => `$${value / 1000}k`,
            },
        },
        colors: ['#AC39D4'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        grid: {
            borderColor: '#E0E0E0',
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5,
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                gradientToColors: ['#2D60FF'],
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100],
            },
        },
    };

    const total = spent + income || 1;
    const series2 = [spent, income, 0];
    const labels = ['Expenses', 'Income', 'Undefined'];
    const colors = ['#6366F1', '#10B981', '#9CA3AF'];
    
    const chartOptions = {
        chart: {
            type: 'donut',
        },
        series: series2,
        labels: labels,
        colors: colors,
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            formatter: function (val, opts) {
                return val + " - " + formatCurrency(opts.w.globals.series[opts.seriesIndex])
            },
            itemMargin: {
                horizontal: 5,
                vertical: 5
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: false,
                    }
                },
            },
        },
        tooltip: {
            y: {
                formatter: (value) => formatCurrency(value),
            },
        },
    };

    // Transform transactions for display
    const transactionsData = transactions.slice(0, 10).map(t => ({
        description: t.name || t.merchant_name || 'Transaction',
        transactionId: t.transaction_id || '#' + Math.random().toString(36).substr(2, 9),
        type: t.category?.[0] || 'Transfer',
        card: '•••• •••• •••• ' + (t.account_id?.slice(-4) || '****'),
        date: new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        amount: t.amount > 0 ? `-${formatCurrency(t.amount)}` : formatCurrency(Math.abs(t.amount)),
        isExpense: t.amount > 0
    }));

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray">Loading statement...</p>
                </div>
            </div>
        );
    }


    return (

        <div className="flex-1 overflow-x-auto  relative m-5">

            <div className="bg-white p-6 rounded-lg ">


                <h1 className='text-lg font-semibold mb-2'>Account</h1>


                <div className='flex justify-between items-center gap-x-3 flex-wrap'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg md:w-[25rem] mt-2'>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account Holder</p>
                            <p className='font-semibold text-sm'>{accountData.holder}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account Number</p>
                            <p className='font-semibold text-sm'>{accountData.accountNumber}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account type</p>
                            <p className='font-semibold text-sm'>{accountData.type}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Currency</p>
                            <p className='font-semibold text-sm'>{accountData.currency}</p>
                        </div>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>

                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Current Balance</p>
                        <h1 className='mt-7 text-lg font-semibold'>{formatCurrency(balance)}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Spent</p>
                        <h1 className='mt-7 text-lg font-semibold'>{formatCurrency(spent)}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiOutlineDotsVertical />
                        </div>
                        <p className='mt-2'>Transactions</p>
                        <h1 className='mt-7 text-lg font-semibold'>{transactionCount}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Income</p>
                        <h1 className='mt-7 text-lg font-semibold'>{formatCurrency(income)}</h1>
                    </div>

                </div>

            </div>


            <div className='flex items-start gap-x-6 flex-wrap w-[100%]'>

                <div className='flex-1 mt-10'>

                    <div className='w-[100%] p-3 rounded-md bg-white'>
                        <h1>Balance history</h1>
                        <Chart options={options} series={series} type="area" height={300} />
                    </div>

                    <div className='w-full p-6 rounded-lg bg-white mt-5'>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className='text-xl font-semibold text-gray-800'>Transaction summary</h1>
                            <div className="flex items-center bg-[#F4F6F9] px-3 py-2 rounded-md text-gray-600 text-sm">
                                <p className='mr-2'>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-full md:w-1/2 flex justify-center">
                                <Chart options={chartOptions} series={series2} type="donut" width="320" />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-start space-y-2">
                                {labels.map((label, index) => {
                                    const percentage = total > 0 ? Math.round((series2[index] / total) * 100) : 0;
                                    return (
                                        <div key={label} className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index] }}></div>
                                                <span className="text-gray-700">{label}</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{percentage}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>

                <div className='flex-1 bg-white p-4 mt-10 rounded-md'>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className='text-xl font-semibold text-gray-800'>Statement</h1>
                        <div className="flex items-center bg-[#F4F6F9] px-3 py-2 rounded-md text-gray-600 text-sm">
                            <p className='mr-2'>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {transactionsData.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <p>No transactions found</p>
                            </div>
                        ) : (
                        <table className="min-w-full divide-y divide-[#F4F6F9]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Description</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#F4F6F9]">
                                {transactionsData.map((transaction, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className={`text-sm font-medium ${transaction.isExpense ? 'text-red-500' : 'text-green-500'}`}>
                                                {transaction.amount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className={`text-sm font-medium ${transaction.isExpense ? 'text-red-500' : 'text-green-500'}`}>
                                                {transaction.isExpense ? "verified" : "pending"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>



            </div>



        </div>

    )
}

export default StatementPage
