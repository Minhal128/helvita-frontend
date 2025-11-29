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

        <div className={`w-[88%] md:w-[97%] flex justify-between m-5 py-3 items-center px-5 bg-white rounded-xl`}>


            <p className='capitalize'>{location=="home"?"Dashboard":location}</p>


            <div className='flex items-center gap-x-4'>
                <Link to={"/dashboard/setting"} className='bg-[#dadADA] rounded-full p-2'>
                    <IoIosSettings/>
                </Link>
                <Link to={"/dashboard/notification"} className='bg-[#dadADA] rounded-full p-2'>
                    <FaBell/>
                </Link>
                <div  onClick={() => toggleNav(!isNavOpen)} className='bg-[#dadADA] rounded-full p-2 lg:hidden block '>
                    <GiHamburgerMenu/>
                </div>
                {/* <GiHamburgerMenu className={`lg:hidden block cursor-pointer md:mt-0 mt-2 text-[#444444]`}/> */}
            </div>


        </div>

    )
}

export default Header