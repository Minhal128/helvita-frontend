import React, { useState } from 'react'
import { HiDotsVertical, HiOutlineDotsVertical } from 'react-icons/hi'
import { IoIosCard } from 'react-icons/io'
import Chart from 'react-apexcharts';
import { FaCalendar } from 'react-icons/fa6';
import { FiDownload } from 'react-icons/fi';
import { LuCircleChevronDown, LuCircleChevronUp } from 'react-icons/lu';

const series = [
    {
        name: 'Activity',
        data: [1500, 5200, 2000, 4500, 4800, 2500, 5500, 5200, 6200, 5800, 8000, 6000, 4500, 6000],
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
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
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

const transactionsData = [
    {
        description: 'Spotify subscription',
        transactionId: '#1234567778',
        type: 'Shopping',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Sales of good',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '15-03-2025',
        amount: '$1000',
    },
    {
        description: 'Sales of good',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '15-03-2025',
        amount: '$1000',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    // {
    //     description: 'Wilson Wilfred',
    //     transactionId: '#1234567778',
    //     type: 'Transfer',
    //     card: '1234 **** **** 2025',
    //     date: '12-03-2025',
    //     amount: '-$120',
    // },
    // {
    //     description: 'Wilson Wilfred',
    //     transactionId: '#1234567778',
    //     type: 'Transfer',
    //     card: '1234 **** **** 2025',
    //     date: '12-03-2025',
    //     amount: '-$120',
    // },
    // {
    //     description: 'Wilson Wilfred',
    //     transactionId: '#1234567778',
    //     type: 'Transfer',
    //     card: '1234 **** **** 2025',
    //     date: '12-03-2025',
    //     amount: '-$120',
    // },
    // {
    //     description: 'Biaq',
    //     transactionId: '#1234567778',
    //     type: 'Transfer',
    //     card: '1234 **** **** 2025',
    //     date: '12-03-2025',
    //     amount: '$120',
    // },
];
const StatementPage = () => {

    const series2 = [522.66, 5863, 53];
    const labels = ['Expenses', 'Income', 'Undefined'];
    const colors = ['#6366F1', '#10B981', '#9CA3AF'];
    const chartOptions = {
        chart: {
            type: 'donut',
        },
        series: series,
        labels: labels,
        colors: colors,
        legend: {
            show: true,
            position: 'bottom', // Consistent legend position
            horizontalAlign: 'center',
            formatter: function (val, opts) {
                return val + " - $" + opts.w.globals.series[opts.seriesIndex]
            },
            itemMargin: {
                horizontal: 5,
                vertical: 5
            },
        },
        dataLabels: {
            enabled: false, // Hide percentage labels on the chart itself
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%', // Adjust the size of the donut hole
                    labels: {
                        show: false, // remove labels.
                    }
                },
            },
        },
        tooltip: {
            y: {
                formatter: (value) => `$${value}`, // Format tooltip values
            },
        },
    };


    return (

        <div className="flex-1 overflow-x-auto  relative m-5">

            <div className="bg-white p-6 rounded-lg ">


                <h1 className='text-lg font-semibold mb-2'>Account</h1>


                <div className='flex justify-between items-center gap-x-3 flex-wrap'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg md:w-[25rem] mt-2'>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account Holder</p>
                            <p className='font-semibold text-sm'>Jessica KIMBERLY</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account Holder</p>
                            <p className='font-semibold text-sm'>1234-5678-92</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account type</p>
                            <p className='font-semibold text-sm'>Savings</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Currency</p>
                            <p className='font-semibold text-sm'>USD</p>
                        </div>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>

                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Current Balance</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Spent</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiOutlineDotsVertical />
                        </div>
                        <p className='mt-2'>Transactions</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Cashback</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
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
                                <p className='mr-2'>Jan 01 - Feb 15</p>
                                <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-full md:w-1/2 flex justify-center">
                                <Chart options={chartOptions} series={series2} type="donut" width="320" />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-start space-y-2">
                                {labels.map((label, index) => {
                                    return (
                                        <div key={label} className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index] }}></div>
                                                <span className="text-gray-700">{label}</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{90}%</span>
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
                            <p className='mr-2'>Jan 01 - Feb 15</p>
                            <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
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
                                            <div className={`text-sm font-medium ${transaction.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                                                {transaction.amount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className={`text-sm font-medium ${transaction.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                                                {transaction.amount.startsWith('-') ? "verified" : "pending"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>



            </div>



        </div>

    )
}

export default StatementPage