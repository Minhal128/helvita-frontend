import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI } from '../../../services/api';

// Admin panel: review users who finished email + identity verification
const AdminDashboardPage = () => {
    const nav = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const res = await adminAPI.getPendingUsers().catch(() => ({ error: 'Failed to load users' }));
        if (res.error) {
            toast.error(res.error);
            if (res.error === 'Admin access required') nav('/admin/login');
        }
        setUsers(res.users || []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const approve = async (id) => {
        const res = await adminAPI.approveUser(id);
        if (res.error || res.errors) return toast.error(res.error || 'Approve failed');
        toast.success('User approved');
        load();
    };

    const reject = async (id) => {
        const reason = window.prompt('Reason for rejection');
        if (!reason) return;
        const res = await adminAPI.rejectUser(id, reason);
        if (res.error || res.errors) return toast.error(res.error || 'Reject failed');
        toast.success('User rejected');
        load();
    };

    const logout = () => {
        localStorage.removeItem('token');
        nav('/admin/login');
    };

    return (
        <div className='min-h-screen bg-[#F4F6F9] p-8'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold'>Admin · Pending approvals</h1>
                <div className='flex gap-2'>
                    <button onClick={load} className='bg-white px-4 py-2 rounded-md'>Refresh</button>
                    <button onClick={logout} className='bg-blue text-white px-4 py-2 rounded-md'>Log out</button>
                </div>
            </div>

            <div className='bg-white rounded-lg mt-6 overflow-x-auto'>
                {loading ? (
                    <p className='p-6 text-gray'>Loading...</p>
                ) : users.length === 0 ? (
                    <p className='p-6 text-gray'>No users waiting for approval</p>
                ) : (
                    <table className='min-w-full text-sm'>
                        <thead className='bg-gray-50 text-left text-gray-500 uppercase text-xs'>
                            <tr>
                                <th className='px-6 py-3'>Email</th>
                                <th className='px-6 py-3'>Account type</th>
                                <th className='px-6 py-3'>Signed up</th>
                                <th className='px-6 py-3'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[#F4F6F9]'>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td className='px-6 py-4'>{u.email}</td>
                                    <td className='px-6 py-4 capitalize'>{u.accountType}</td>
                                    <td className='px-6 py-4'>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className='px-6 py-4 flex gap-2 justify-end'>
                                        <button onClick={() => approve(u._id)} className='bg-green-600 text-white px-3 py-1 rounded-md'>Approve</button>
                                        <button onClick={() => reject(u._id)} className='bg-red-600 text-white px-3 py-1 rounded-md'>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
