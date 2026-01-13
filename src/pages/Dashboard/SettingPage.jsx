import React, { useState, useEffect } from 'react'
import { FaBell, FaCreditCard, FaLock, FaTrashAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoShield } from 'react-icons/io5'
import { LuLanguages } from 'react-icons/lu'
import { MdEmail, MdPrivacyTip } from 'react-icons/md'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SettingPage = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const [btns] = useState(["Account settings", "Payment & cards", "Preferences", "Security & privacy"])
    const [activeBtn, setActiveBtn] = useState(btns[0])
    const [activeSubMenu, setActiveSubMenu] = useState('email') // Track submenu selection
    const [userProfile, setUserProfile] = useState(null)
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [oldEmail, setOldEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en')
    const [billingHistory, setBillingHistory] = useState([])
    const [showBillingHistory, setShowBillingHistory] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const profileRes = await authAPI.getProfile().catch(() => null)

            if (profileRes && !profileRes.error) {
                setUserProfile(profileRes)
                // Use savedCards from profile response
                if (profileRes.savedCards && profileRes.savedCards.length > 0) {
                    setCards(profileRes.savedCards)
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang)
        i18n.changeLanguage(lang)
        localStorage.setItem('language', lang)
        toast.success(t('settings.language') + ' updated!')
    }

    const handleViewBillingHistory = () => {
        setShowBillingHistory(true)
        // Fetch billing history - mock data for now
        setBillingHistory([
            { id: 1, date: '2024-01-10', description: 'Monthly Subscription', amount: '$9.99', status: 'Paid' },
            { id: 2, date: '2024-02-10', description: 'Monthly Subscription', amount: '$9.99', status: 'Paid' },
            { id: 3, date: '2024-03-10', description: 'Monthly Subscription', amount: '$9.99', status: 'Pending' },
        ])
    }

    const handleUpdateEmail = () => {
        if (!oldEmail || !newEmail) {
            toast.error('Please fill in both email fields')
            return
        }
        // Here you would call API to update email
        toast.success('Email update request sent!')
        setOldEmail('')
        setNewEmail('')
    }

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error('Please enter your password to confirm')
            return
        }
        
        setDeleting(true)
        try {
            const response = await authAPI.deleteAccount(deletePassword)
            if (response.success) {
                toast.success('Account deleted successfully')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/login')
            } else {
                toast.error(response.error || 'Failed to delete account')
            }
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.error('Failed to delete account')
        } finally {
            setDeleting(false)
            setShowDeleteModal(false)
            setDeletePassword('')
        }
    }

    return (
        <div className="flex-1 overflow-x-auto  relative m-5 h-[100%]">


            <div className='p-5 rounded-md bg-white flex items-start flex-wrap md:flex-row flex-col h-[85vh]"'>

                <div className='mt-2  flex-1  h-full"'>

                    <div className='flex items-center gap-x-4 border-b border-b-[#DADADA] pb-5 flex-wrap'>
                        {
                            btns?.map((i) => (
                                <button onClick={() => setActiveBtn(i)} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == i ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>{i}</button>
                            ))
                        }
                    </div>


                    <div className='flex items-start flex-wrap'>

                        <div className='pt-5 border-r border-[#DADADA] md:min-w-[20rem]'>
                            {
                                activeBtn === "Account settings" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><MdEmail /></div>
                                            <div>
                                                <p className='text-[#525252]'>Update email address</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaLock /></div>
                                            <div>
                                                <p className='text-[#525252]'>Change Password</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><IoShield /></div>
                                            <div>
                                                <p className='text-[#525252]'>Add 2FA</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Payment & cards" && (
                                    <div>
                                        <div 
                                            onClick={() => setShowBillingHistory(false)}
                                            className={`flex items-center gap-x-4 p-3 cursor-pointer ${!showBillingHistory ? 'bg-[#F4F6F9] border-r-[5px] border-r-blue' : ''}`}
                                        >
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaCreditCard /></div>
                                            <div>
                                                <p className='text-[#525252]'>{t('settings.manageSavedCards')}</p>
                                            </div>
                                        </div>
                                        <div 
                                            onClick={handleViewBillingHistory}
                                            className={`flex items-center gap-x-4 p-3 cursor-pointer hover:bg-[#F4F6F9] ${showBillingHistory ? 'bg-[#F4F6F9] border-r-[5px] border-r-blue' : ''}`}
                                        >
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaLock /></div>
                                            <div>
                                                <p className='text-[#525252]'>{t('settings.viewBillingHistory')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Preferences" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><LuLanguages /></div>
                                            <div>
                                                <p className='text-[#525252]'>Language </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaBell /></div>
                                            <div>
                                                <p className='text-[#525252]'>Notification preferences</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Security & privacy" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><MdPrivacyTip /></div>
                                            <div>
                                                <p className='text-[#525252]'>Privacy preference</p>
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => setShowDeleteModal(true)}
                                            className='flex items-center gap-x-4 p-3 cursor-pointer hover:bg-red-50 transition-colors'
                                        >
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-red-100 text-red-500 flex justify-center items-center'><FaTrashAlt /></div>
                                            <div>
                                                <p className='text-red-500 font-medium'>Delete Account</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>


                        <div className='flex-1'>

                            {
                                activeBtn === "Account settings" && (
                                    <div className='m-5'>
                                        <input 
                                            type="email" 
                                            value={oldEmail}
                                            onChange={(e) => setOldEmail(e.target.value)}
                                            placeholder={userProfile?.user?.email || 'Enter old email address'} 
                                            className='border border-[#DADADA] w-[100%] md:w-[20rem] px-3 py-2 h-[2.8rem] rounded-md text-sm' 
                                        />
                                        <input 
                                            type="email" 
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder='Enter new email address' 
                                            className='block border border-[#DADADA] mt-2 w-[100%] md:w-[20rem] px-3 py-2 h-[2.8rem] rounded-md text-sm' 
                                        />
                                        <button 
                                            onClick={handleUpdateEmail}
                                            className='bg-blue text-white rounded-md px-9 py-2 mt-3 hover:bg-blue/90'
                                        >
                                            Update
                                        </button>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Payment & cards" && (
                                    <div className='m-5'>
                                        {!showBillingHistory ? (
                                            <table className="min-w-full border-collapse border border-[#F4F6F9] mt-3 ">
                                                <thead className="bg-gray-50 border border-[#F4F6F9]">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cards.cardName')}</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cards.bank')}</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cards.cardNumber')}</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"><HiDotsVertical /></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white border border-[#F4F6F9]">
                                                    {loading ? (
                                                        <tr className='border border-[#F4F6F9]'>
                                                            <td colSpan="4" className="px-6 py-4 text-center">{t('cards.loading')}</td>
                                                        </tr>
                                                    ) : cards.length > 0 ? (
                                                        cards.map((card, index) => (
                                                            <tr key={card.id || index} className='border border-[#F4F6F9]'>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                                                            {card.name?.charAt(0) || 'C'}
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {card.name || userProfile?.profile?.fullName || 'Card Holder'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap ">
                                                                    <div className="text-sm text-gray-900">{card.subtype || card.type || 'Bank'}</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap ">
                                                                    <div className="text-sm text-gray-900">•••• •••• •••• {card.mask || '****'}</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap ">
                                                                    <div className="text-sm text-gray-900 cursor-pointer"><HiDotsVertical /></div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr className='border border-[#F4F6F9]'>
                                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                                <p>{t('cards.noCards')}</p>
                                                                <p className="text-sm mt-1">{t('cards.linkBank')}</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div>
                                                <h2 className='text-lg font-semibold mb-4'>{t('billing.title')}</h2>
                                                {billingHistory.length > 0 ? (
                                                    <table className="min-w-full border-collapse border border-[#F4F6F9]">
                                                        <thead className="bg-gray-50 border border-[#F4F6F9]">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('billing.date')}</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('billing.description')}</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('billing.amount')}</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('billing.status')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white border border-[#F4F6F9]">
                                                            {billingHistory.map((item) => (
                                                                <tr key={item.id} className='border border-[#F4F6F9]'>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                            {item.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <p>{t('billing.noBillingHistory')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Preferences" && (
                                    <div className='m-5 flex-1'>
                                        <div 
                                            onClick={() => handleLanguageChange('en')}
                                            className='flex justify-between items-center w-[100%] cursor-pointer hover:bg-[#F4F6F9] p-2 rounded'
                                        >
                                            <h1>{t('languages.english')}</h1>
                                            <input 
                                                checked={selectedLanguage === 'en'} 
                                                onChange={() => handleLanguageChange('en')}
                                                type="radio" 
                                                name="language" 
                                            />
                                        </div>
                                        <div 
                                            onClick={() => handleLanguageChange('fr')}
                                            className='flex justify-between items-center w-[100%] mt-2 cursor-pointer hover:bg-[#F4F6F9] p-2 rounded'
                                        >
                                            <h1>{t('languages.french')}</h1>
                                            <input 
                                                checked={selectedLanguage === 'fr'} 
                                                onChange={() => handleLanguageChange('fr')}
                                                type="radio" 
                                                name="language" 
                                            />
                                        </div>
                                        <div 
                                            onClick={() => handleLanguageChange('ru')}
                                            className='flex justify-between items-center w-[100%] mt-2 cursor-pointer hover:bg-[#F4F6F9] p-2 rounded'
                                        >
                                            <h1>{t('languages.russian')}</h1>
                                            <input 
                                                checked={selectedLanguage === 'ru'} 
                                                onChange={() => handleLanguageChange('ru')}
                                                type="radio" 
                                                name="language" 
                                            />
                                        </div>
                                        <div 
                                            onClick={() => handleLanguageChange('pl')}
                                            className='flex justify-between items-center w-[100%] mt-2 cursor-pointer hover:bg-[#F4F6F9] p-2 rounded'
                                        >
                                            <h1>{t('languages.polish')}</h1>
                                            <input 
                                                checked={selectedLanguage === 'pl'} 
                                                onChange={() => handleLanguageChange('pl')}
                                                type="radio" 
                                                name="language" 
                                            />
                                        </div>
                                    </div>
                                )
                            }


                            {
                                activeBtn === "Security & privacy" && (
                                    <div className='m-5 flex-1'>
                                        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4'>
                                            <h3 className='text-yellow-800 font-medium mb-2'>⚠️ Warning</h3>
                                            <p className='text-yellow-700 text-sm'>
                                                Deleting your account is permanent. All your data, cards, and transaction history will be permanently removed.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setShowDeleteModal(true)}
                                            className='bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors'
                                        >
                                            Delete My Account
                                        </button>
                                    </div>
                                )
                            }


                        </div>

                    </div>






                </div>




            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-[90%] max-w-md'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Delete Account</h2>
                        <p className='text-gray-600 mb-4'>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <p className='text-sm text-gray-500 mb-4'>
                            Please enter your password to confirm:
                        </p>
                        <input 
                            type="password" 
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder='Enter your password'
                            className='w-full border border-gray-300 rounded-md px-3 py-2 mb-4'
                        />
                        <div className='flex gap-3 justify-end'>
                            <button 
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeletePassword('')
                                }}
                                className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50'
                            >
                                {deleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default SettingPage