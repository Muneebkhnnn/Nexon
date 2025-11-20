import { SignIn, useUser } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';
import React,{useState} from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Menu, X } from 'lucide-react';

function Layout() {
    const navigate = useNavigate()
    const [sidebar, setSidebar] = useState(false);
    const { user } = useUser();

    return user ? (
        <div className='flex flex-col items-start justify-start h-screen'>
            <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
                <div className='flex gap-2 items-center cursor-pointer' onClick={() => navigate('/')}>
                    <img src={logo} alt="logo" className=' cursor-pointer w-14 sm:w-16'
                        onClick={() => navigate('/')} />
                    <h1 className='text-primary font-bold  text-2xl'>Nexon</h1>

                </div>
                {
                    sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 cursor-pointer sm:hidden' />
                        : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 cursor-pointer sm:hidden' />
                }
            </nav>

            <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
                <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
                <div className='flex-1 bg-[F4F7FB]'>
                    <Outlet />
                </div>
            </div>
        </div>
        ) : (
        <div className="flex items-center justify-center h-screen" >
            <SignIn />
        </div>
    )
           
    
}

export default Layout