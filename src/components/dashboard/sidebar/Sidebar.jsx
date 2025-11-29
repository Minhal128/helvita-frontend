import React, { useEffect, useRef, useState } from 'react';
import { navData } from '../../../constants/sidebarData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';
import { useSidebar } from '../../../context/SidebarContext';
import LightModeLogo from '../../../assets/logo.svg'

import { useTheme } from '../../../context/ThemeContext';

const Sidebar = () => {
  const { theme } = useTheme();
  const location = useLocation().pathname.split("/")[2];
  console.log(location)
  const { isNavOpen, toggleNav } = useSidebar();
  const sidebarRef = useRef(null);
  const nav = useNavigate()
  // 1D1D1F
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleNav();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleNav]);






  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`lg:block hidden w-[15rem] h-[100vh] ${theme == "dark" ? "bg-[#fff]" : "bg-[#fff]"} relative border-r border-r-[#dadada]`}>

        <div className="flex-shrink-0 flex items-center gap-x-2 pt-5">
          <img src={LightModeLogo} alt="" className='h-8' />
          <p className='text-lg font-semibold -ml-[1.5rem]'>Helvetia Bank</p>
        </div>

        <div className='mt-7'>
          {navData?.map((i) => (
            <Link to={`/dashboard/${i.link}`} key={i.id} className={`flex pl-5 justify-between items-center gap-x-3 mb-1 cursor-pointer ${(location == i.link || (location == "home" && i.link == "home?query=Music")) ? "text-blue" : "text-gray"}`}>
              <div className='flex items-center gap-x-3 '>
                <div>{i.icon}</div>
                <p className='text-sm'>{i.name}</p>
              </div>
              <div className={`w-1 h-8 ${(location == i.link || (location == "home" && i.link == "home?query=Music")) ? "bg-blue" : "bg-transparent"} rounded-tl-md rounded-bl-md`}></div>
            </Link>
          ))}


        </div>

        <div className='absolute bottom-5 w-[80%] flex justify-between items-center mx-5 '>
          <div onClick={() => nav("/")} className='flex items-center gap-x-2 cursor-pointer'>
            <IoLogOut className='text-[#FF1700] cursor-pointer text-xl' />
            <p className='text-xs text-[#FF1700]'>Logout</p>
          </div>
        </div>

      </div>

      {/* Mobile Sidebar */}
      {
        isNavOpen && (
          <div className={`lg:hidden block w-[14rem] z-50 h-[100vh] bg-[#ffff] fixed top-0 left-0 transition-all duration-300 ease-in-out ${isNavOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`} ref={sidebarRef}>

            <div className="flex-shrink-0 flex items-center gap-x-2 pt-5">
              <img src={LightModeLogo} alt="" className='h-8' />
              <p className='text-lg font-semibold -ml-[1.5rem]'>Helvetia Bank</p>
            </div>


            <div className='mt-7'>
              <p className='text-sm text-[#8D8D8D] pl-5 mb-2'>Menu</p>
              {navData?.map((i) => (
                <Link to={`/dashboard/${i.link}`} key={i.id} className={`flex pl-5 justify-between items-center gap-x-3 mb-1 cursor-pointer ${(location == i.link || (location == "home" && i.link == "home?query=Music")) ? "text-blue" : "text-gray"}`}>
                  <div className='flex items-center gap-x-3 '>
                    <div>{i.icon}</div>
                    <p className='text-sm'>{i.name}</p>
                  </div>
                  <div className={`w-1 h-8 ${(location == i.link || (location == "home" && i.link == "home?query=Music")) ? "bg-blue" : "bg-transparent"} rounded-tl-md rounded-bl-md`}></div>
                </Link>
              ))}

            </div>

            <div className='absolute bottom-5 w-[80%] flex justify-between items-center mx-5 '>
              <div onClick={() => nav("/")} className='flex items-center gap-x-2 cursor-pointer'>
                <IoLogOut className='text-blue cursor-pointer text-xl' />
                <p className='text-xs text-blue'>Logout</p>
              </div>
            </div>

          </div>
        )}
    </>
  );
};

export default Sidebar;
