import CardImage from '../../assets/dashboard/card.svg'
import GraphImage from '../../assets/landing/graph.svg'
import Chart from 'react-apexcharts';
import { FiCalendar, FiSettings } from 'react-icons/fi';
import { IoIosSend } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa6";
import { MdCompareArrows } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const transactions = [
    {
      id: 1,
      icon: <FiCalendar className="text-red-500" />,
      name: 'Starbucks New York LLP',
      date: '12.01.2020 09:34',
      amount: '-$5,30',
      isExpense: true,
    },
    {
      id: 2,
      icon: <FiCalendar className="text-red-500" />,
      name: 'Walmart Marketplace',
      date: '11.01.2020 21:34',
      amount: '-$135',
      isExpense: true,
    },
    {
      id: 3,
      icon: <FiCalendar className="text-green-500" />,
      name: 'From Catherine Pierce',
      date: '11.01.2020 18:08',
      amount: '+$250',
      isExpense: false,
    },
  ];

  return (


    <div className="flex-1 overflow-x-auto  relative m-5">



      <div className='flex items-start gap-x-5 overflow-x-auto w-[100%]'>


        <div className='min-w-[20rem]'>
          <img src={CardImage} alt="" />
        </div>

        <div className='flex-1 min-w-[20rem] w-[100%] bg-white rounded-xl p-5'>
          <p className='text-gray'>Available balance</p>
          <h1 className='text-3xl font-semibold mt-2'>$250,000.00</h1>

          <div className='mt-5 bg-[#F4F6F9] p-3 rounded-md'>
            <h1 className='font-semibold'>Pending</h1>
            <div className='flex justify-between items-center mt-2'>
              <p className='text-gray'>Stripe</p>
              <p className='font-medium'>-$300</p>
            </div>
          </div>

        </div>

        <div className='flex-1 min-w-[20rem] w-[100%] bg-white rounded-xl p-5'>
          <p className='text-[#2A2F47]'>My expense</p>
          <div className='flex justify-center items-center'><img src={GraphImage} alt="" className='h-[12.5rem]' /></div>
        </div>



      </div>


      <div className='flex items-start gap-x-5 overflow-x-auto w-full mt-10'>
        <div className='flex-1 min-w-[25rem] bg-white rounded-xl p-5'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Activity</h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiCalendar />
              <span>Jan 21 - Sep 21, 2022</span>
            </div>
          </div>
          <Chart options={options} series={series} type="area" height={300} />
        </div>

        <div className='min-w-[22rem] bg-white rounded-xl p-5'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
            <FiSettings className="text-gray-600 cursor-pointer" />
          </div>
          <ul className="space-y-3">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {transaction.icon}
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

      <div className='flex justify-between items-start gap-x-5 overflow-x-auto w-[100%] mt-10 flex-wrap'>


        <div className='md:min-w-[25rem] md:max-w-[25rem] w-[100%] bg-white rounded-xl p-5 mt-2'>

          <div className='flex justify-between items-center'>

            <div className='flex items-center gap-x-3'>
              <IoIosSend className='text-blue' />
              <p className='text-lg font-semibold'>Transfer</p>
            </div>

            <HiDotsHorizontal className='text-blue' />

          </div>

          <div className='flex justify-between items-center mt-3'>
            <input type="text" name="" id="" className='border border-[#AEB1B4] px-3 py-2 rounded-md outline-none w-fit' placeholder='9876 8774 5443 0000 1289' />
            <div className='w-8 h-8 rounded-full bg-blue flex justify-center items-center text-white'><FaArrowRight /></div>
          </div>

          <p className='mt-2 text-gray text-sm'>Visa or MasterCard of any Poland Bank</p>

        </div>

        <div className='md:min-w-[25rem] md:max-w-[25rem] w-[100%] bg-white rounded-xl p-5 mt-2'>

          <div className='flex justify-between items-center'>

            <div className='flex items-center gap-x-3'>
              <CgArrowsExchange className='text-blue' />
              <p className='text-lg font-semibold'>Conversion</p>
            </div>

            <HiDotsHorizontal className='text-blue' />

          </div>

          <div className='flex justify-between items-center mt-3 gap-x-3'>
            <input type="text" name="" id="" className='w-[10rem] border border-[#AEB1B4] px-3 py-2 rounded-md outline-none' placeholder='5 100' />
            <MdCompareArrows className='text-blue' />
            <input type="text" name="" id="" className='w-[10rem] border border-[#AEB1B4] px-3 py-2 rounded-md outline-none' placeholder='5 100' />
          </div>

          <p className='mt-2 text-gray text-sm'>Rate = 5.01 (Jun 21, 13:99 UTC)</p>

        </div>

        <div className='md:min-w-[25rem] md:max-w-[25rem] w-[100%] bg-white rounded-xl p-5 mt-2'>
          <h1 className='font-medium'>Quick Transfer</h1>
          <div className='flex items-center mt-2'>
            {[1, 2, 3, 4, 5, 6, 7]?.map((i) => (<img key={i} className='w-10 h-10 rounded-full bg-center' src='https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-881954-2379004.jpg&fm=jpg' />))}
          </div>
          <input type="text" name="" id="" className='border border-[#AEB1B4] px-3 py-2 rounded-md outline-none w-full mt-3' placeholder='9876 8774 5443 0000 1289' />

          <div className='flex items-center gap-x-2 mt-2'>
            <button className='flex-1 border border-blue py-3 rounded-lg text-blue'>Save as draft</button>
            <button className='flex-1 bg-blue text-white py-3 rounded-lg'>Send money</button>
          </div>
        </div>




      </div>




    </div >
  );
};

export default HomePage;