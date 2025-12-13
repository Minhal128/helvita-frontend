import React, { useState, useEffect } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiBankFill } from "react-icons/ri";
import { plaidAPI } from '../../services/api';

const NotificationPage = () => {
    const [activeBtn, setActiveBtn] = useState("all")
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Generate notifications from recent transactions
            const transRes = await plaidAPI.getTransactions().catch(() => ({ data: { transactions: [] } }));
            const transactions = transRes.data?.transactions || [];
            
            // Convert transactions to notifications
            const notifs = transactions.slice(0, 10).map((t, index) => ({
                id: t.transaction_id || index,
                type: t.amount > 0 ? 'expense' : 'deposit',
                title: t.amount > 0 ? 'Payment made' : 'Deposit received',
                message: t.amount > 0 
                    ? `Payment of $${Math.abs(t.amount).toFixed(2)} to ${t.name || t.merchant_name || 'merchant'}`
                    : `Deposit of $${Math.abs(t.amount).toFixed(2)} has been received`,
                date: new Date(t.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
                read: index > 2 // Mark first 3 as unread
            }));
            
            setNotifications(notifs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeBtn === 'all') return true;
        if (activeBtn === 'read') return n.read;
        if (activeBtn === 'unread') return !n.read;
        return true;
    });

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-x-auto  relative m-5 h-[100%]">


            <div className='p-5 rounded-md bg-white flex items-start flex-wrap md:flex-row flex-col h-[85vh]"'>

                <div className='mt-2  flex-1  h-full"'>

                    <div className='flex items-center gap-x-4 border-b border-b-[#DADADA] pb-5 flex-wrap'>
                        <button onClick={() => setActiveBtn("all")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "all" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>All ({notifications.length})</button>
                        <button onClick={() => setActiveBtn("read")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "read" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>Read ({notifications.filter(n => n.read).length})</button>
                        <button onClick={() => setActiveBtn("unread")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "unread" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>Unread ({notifications.filter(n => !n.read).length})</button>
                    </div>


                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>No notifications</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div key={notification.id} className={`mt-3 flex justify-between items-center flex-wrap ${!notification.read ? 'bg-blue-50 p-2 rounded-md' : ''}`}>

                                <div className='flex items-center gap-x-4'>
                                    <div className={`w-[2rem] h-[2rem] rounded-full ${notification.type === 'deposit' ? 'bg-green-100 text-green-500' : 'bg-[#F4F4FF] text-blue'} flex justify-center items-center`}>
                                        <RiBankFill />
                                    </div>
                                    <div>
                                        <p className='font-semibold'>{notification.title}   |   <span className='text-gray'>{notification.date}</span></p>
                                        <p className='text-sm mt-1'>{notification.message}</p>
                                    </div>
                                </div>

                                <FaTrash 
                                    className="cursor-pointer text-gray hover:text-red-500 transition-colors" 
                                    onClick={() => handleDelete(notification.id)}
                                />


                            </div>
                        ))
                    )}




                </div>




            </div>

        </div>
    )
}

export default NotificationPage