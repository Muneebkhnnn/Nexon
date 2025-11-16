import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonials from '../components/Testimonials'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
import { useAuth } from "@clerk/clerk-react"

function Home() {
  const { getToken } = useAuth();
  useEffect(() => {
    getToken().then(token => console.log(token))
  }), []

  return (
    <>
      <Navbar />
      <Hero />
      <AiTools />
      <Testimonials />
      <Plan />
      <Footer />
    </>
  )
}

export default Home