import React from 'react'
import Logo from '../assets/logo.svg';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <footer className="bg-blue text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                <div className="flex flex-col items-start">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <img src={Logo} alt="Helvetia Bank AG Logo" className="h-8" />
                        <span className="font-bold text-xl">Helvetia Bank AG</span>
                    </Link>
                    <p className="text-sm text-white">Be part of a movement that empowers you spiritually and financially.Unlock exclusive resources, mentorship, and opportunities designed for believers like you.</p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-4">Business Banking</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link className="hover:text-gray-300 text-sm">Credit Card</Link>
                        </li>
                        <li>
                            <Link className="hover:text-gray-300 text-sm">Funding</Link>
                        </li>
                        <li>
                            <Link className="hover:text-gray-300 text-sm">Invoices</Link>
                        </li>
                        <li>
                            <Link className="hover:text-gray-300 text-sm">Bookkeeping</Link>
                        </li>
                    </ul>
                </div>

                {/* Our Resources */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Our Resources</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link className="hover:text-gray-300 text-sm">Careers</Link>
                        </li>
                        <li>
                            <Link className="hover:text-gray-300 text-sm">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                {/* Get In Touch */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Get In Touch</h3>
                    <p className="text-sm text-gray-300 mb-4">Support@pbtc.ag</p>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="bg-black rounded-md flex justify-center items-center p-2" aria-label="Facebook">
                            <FaFacebook size={20} />
                        </a>
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="bg-black rounded-md flex justify-center items-center p-2" aria-label="Twitter">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="bg-black rounded-md flex justify-center items-center p-2" aria-label="Instagram">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="bg-black rounded-md flex justify-center items-center p-2" aria-label="YouTube">
                            <FaYoutube size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300">
                <p>© {new Date().getFullYear()} PBTC, All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link to="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
                    <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer