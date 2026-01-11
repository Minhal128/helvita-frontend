import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosSettings } from "react-icons/io";
import { FaBell } from 'react-icons/fa6';

const Header = ({ location }) => {
    const { theme, toggleTheme } = useTheme();
    const { isNavOpen, toggleNav } = useSidebar();
    const nav = useNavigate()
    const currentLocation = useLocation();
    const queryParams = new URLSearchParams(currentLocation.search);
    const queryValue = queryParams.get('query');

    return (

        <div className={`w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] flex justify-between mx-2.5 sm:mx-5 my-3 sm:my-5 py-2 sm:py-3 items-center px-3 sm:px-5 bg-white rounded-xl`}>


            <p className='capitalize text-sm sm:text-base truncate'>{location=="home"?"Dashboard":location}</p>


            <div className='flex items-center gap-x-2 sm:gap-x-4 flex-shrink-0'>
                <Link to={"/dashboard/setting"} className='bg-[#dadADA] rounded-full p-1.5 sm:p-2'>
                    <IoIosSettings className='text-sm sm:text-base'/>
                </Link>
                <Link to={"/dashboard/notification"} className='bg-[#dadADA] rounded-full p-1.5 sm:p-2'>
                    <FaBell className='text-sm sm:text-base'/>
                </Link>
                <div  onClick={() => toggleNav(!isNavOpen)} className='bg-[#dadADA] rounded-full p-1.5 sm:p-2 lg:hidden block cursor-pointer'>
                    <GiHamburgerMenu className='text-sm sm:text-base'/>
                </div>
                {/* <GiHamburgerMenu className={`lg:hidden block cursor-pointer md:mt-0 mt-2 text-[#444444]`}/> */}
            </div>


        </div>

    )
}

export default Header