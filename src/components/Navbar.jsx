import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const nav = [
        { name: 'Banking', link: '/' },
        { name: 'Solution', link: '/solution' },
        { name: 'Support', link: '/support' },
    ];

    return (
        <nav className="bg-white shadow">

            <div className="px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    <img src={Logo} alt="Logo" className="h-10" />

                    <div className="hidden md:flex items-center gap-x-4">
                        {nav?.map((item) => (
                            <Link key={item?.name} to={item.link} className="text-[#5C5C5C] hover:text-gray-700">{item?.name}</Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-x-3">

                        <Link to="/login" className="text-[#5C5C5C] px-3 md:px-5 py-2 rounded-3xl text-xs md:text-sm font-medium hover:bg-gray-100">Login</Link>

                        <Link to="/register">
                            <button className="bg-[#3D44E3] px-3 md:px-5 py-2 rounded-md text-xs md:text-sm font-medium text-white hover:bg-[#2e34d3]">Get Started</button>
                        </Link>

                    </div>

                    <div className="flex md:hidden">
                        {isOpen ? <RxCross1 className="h-6 w-6" onClick={toggleNavbar} /> : <RxHamburgerMenu className="h-6 w-6" onClick={toggleNavbar} />}
                    </div>

                </div>
            </div>

            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {nav?.map((item) => (
                        <Link key={item?.name} to={item.link} className="block bg-gray-50 py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">{item?.name}</Link>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="px-2 space-y-1">
                        <Link to="/login" className="block bg-gray-50 py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">Login</Link>
                        <Link to="/register">
                            <button className="block w-full text-left bg-[#3D44E3] py-2 px-3 rounded-md text-base font-medium text-white hover:bg-[#2e34d3]">Get Started</button>
                        </Link>
                    </div>
                </div>
            </div>
            
        </nav>
    );
};

export default Navbar;