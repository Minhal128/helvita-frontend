import React, { useState, useEffect } from 'react'
import { IoIosCard } from 'react-icons/io'
import { PlusCircle, ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react'; // Import icons
import { FaCalendar, FaPlus } from 'react-icons/fa'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { authAPI } from '../../services/api';

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        paid: 0,
        unpaid: 0,
        overdue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            // Try to get profile which may have invoices
            const response = await authAPI.getProfile().catch(() => ({ profile: {} }));
            
            // If invoices exist in the response, use them; otherwise show empty state
            const invoiceData = response.profile?.invoices || [];
            setInvoices(invoiceData);

            // Calculate summary
            const paid = invoiceData.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
            const unpaid = invoiceData.filter(i => i.status === 'Pending').reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
            const overdue = invoiceData.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

            setSummary({
                total: paid + unpaid + overdue,
                paid,
                unpaid,
                overdue
            });
        } catch (error) {
            console.error('Error fetching invoices:', error);
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'Pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'Overdue':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };


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

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray">Loading invoices...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex-1 overflow-x-auto  relative m-5">

            <div className="bg-white p-6 rounded-lg ">

                <div className='flex justify-between items-center gap-x-3 flex-wrap'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Total invoice generated</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{formatCurrency(summary.total)}</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Paid invoice</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{formatCurrency(summary.paid)}</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Unpaid Invoice</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{formatCurrency(summary.unpaid)}</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Overdue Invoices</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{formatCurrency(summary.overdue)}</h1>
                    </div>

                </div>

            </div>


            <div className='mt-10 bg-white p-6 rounded-lg'>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center bg-[#F4F6F9] px-3 py-2 rounded-md text-gray-600 text-sm">
                        <p className='mr-2'>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                    </div>
                    <button onClick={fetchInvoices} className="bg-blue text-white py-2 px-4 rounded flex items-center">
                        <FaPlus className="mr-2" />
                        <p>Refresh</p>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {invoices.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>No invoices found</p>
                            <p className="text-sm mt-2">Invoices will appear here once created</p>
                        </div>
                    ) : (
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
                            {invoices.map((invoice, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">{getStatusIcon(invoice.status)}<span className="ml-2 text-sm text-gray-900">{invoice.invoiceNumber || `#INV-${String(index + 1).padStart(3, '0')}`}</span></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customerName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.status}</td>
                                    <td className="px-6 py-3 flex justify-center items-center"><HiOutlineDotsVertical /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

        </div>
    )
}

export default InvoicesPage