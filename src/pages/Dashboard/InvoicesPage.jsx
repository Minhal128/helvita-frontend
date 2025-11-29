import React from 'react'
import { IoIosCard } from 'react-icons/io'
import { PlusCircle, ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react'; // Import icons
import { FaCalendar, FaPlus } from 'react-icons/fa'
import { HiOutlineDotsVertical } from "react-icons/hi";

const InvoicesPage = () => {

    const transactions = [
        {
            invoiceNumber: '#INV-001',
            customerName: 'ABC Corp',
            issueDate: '01-01-2025',
            dueDate: '15-01-2025',
            status: 'Paid',
            amount: '$1200',
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        },
        {
            invoiceNumber: '#INV-002',
            customerName: 'XYZ Ltd',
            issueDate: '02-01-2025',
            dueDate: '16-01-2025',
            status: 'Pending',
            amount: '$2500',
            icon: <Clock className="h-4 w-4 text-yellow-500" />,
        },
        {
            invoiceNumber: '#INV-003',
            customerName: 'PQR Co',
            issueDate: '05-01-2025',
            dueDate: '19-01-2025',
            status: 'Overdue',
            amount: '$1800',
            icon: <XCircle className="h-4 w-4 text-red-500" />,
        },
        {
            invoiceNumber: '#INV-004',
            customerName: 'ABC Corp',
            issueDate: '10-01-2025',
            dueDate: '24-01-2025',
            status: 'Paid',
            amount: '$950',
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        },
        {
            invoiceNumber: '#INV-005',
            customerName: 'LMN Inc',
            issueDate: '12-01-2025',
            dueDate: '26-01-2025',
            status: 'Pending',
            amount: '$3200',
            icon: <Clock className="h-4 w-4 text-yellow-500" />,
        },
        {
            invoiceNumber: '#INV-006',
            customerName: 'PQR Co',
            issueDate: '15-01-2025',
            dueDate: '29-01-2025',
            status: 'Overdue',
            amount: '$1450',
            icon: <XCircle className="h-4 w-4 text-red-500" />,
        },
    ]


    const getTypeColor = (type) => {
        switch (type) {
            case 'Pending':
                return 'text-yellow-500';
            case 'Paid':
                return 'text-green-500';
            case 'Overdue':
                return 'text-red-500';
            default:
                return 'text-gray-700';
        }
    };
    
    return (
        <div className="flex-1 overflow-x-auto  relative m-5">

            <div className="bg-white p-6 rounded-lg ">

                <div className='flex justify-between items-center gap-x-3 flex-wrap'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Total invoice generated</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>$140,000</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Paid invoice</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>$140,000</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Unpaid Invoice</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>$140,000</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Overdue Invoices</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>$140,000</h1>
                    </div>

                </div>

            </div>


            <div className='mt-10 bg-white p-6 rounded-lg'>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center bg-[#F4F6F9] px-3 py-2 rounded-md text-gray-600 text-sm">
                        <p className='mr-2'>Jan 01 - Feb 15</p>
                        <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                    </div>
                    <button className="bg-blue text-white py-2 px-4 rounded flex items-center">
                        <FaPlus className="mr-2" />
                        <p>New reserve</p>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr className='border border-[#F4F6F9]'>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 flex justify-center items-center"><HiOutlineDotsVertical /></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#F4F6F9] border border-[#F4F6F9]">
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">{transaction.icon}<span className="ml-2 text-sm text-gray-900">{transaction.invoiceNumber}</span></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.dueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.status}</td>
                                    <td className="px-6 py-3 flex justify-center items-center"><HiOutlineDotsVertical /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default InvoicesPage