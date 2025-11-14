import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast';




function App() {

  useEffect(() => {
    console.log("App mounted")
  }, [])
  

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

    </>
  )
}

export default App