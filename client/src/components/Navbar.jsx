import { ArrowRight } from 'lucide-react';
import React from 'react'
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

function Navbar() {

    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();

    return (
        <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
            <div className='flex gap-2 items-center cursor-pointer' onClick={() => navigate('/')}>
                <img src={logo} alt="logo" className=' cursor-pointer w-14 sm:w-16'
                    onClick={() => navigate('/')} />
                <h1 className='text-primary font-bold  text-2xl'>Nexon</h1>

            </div>
                {user ? <UserButton /> : (
                    <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>Get started <ArrowRight className='w-4 h-4' /> </button>
                )}

            
        </div>

    )
}

export default Navbar