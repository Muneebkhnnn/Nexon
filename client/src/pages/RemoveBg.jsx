import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function RemoveBg() {

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();


  const onSubmitHandler = async (e) => {

    e.preventDefault();

    try {
      setLoading(true);
      
      if (!input) {
        return toast.error("Please upload an image");
      }
      setContent('');

      const formdata = new FormData()
      formdata.append('image', input)

      const response = await axios.post('/api/v1/ai/remove-image-background', formdata,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      console.log(response.data);

      if (response.data.success && response.data.data) {
        setContent(response.data.data);
        toast.success('Background Removed successfully!');
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove background';
      toast.error(errorMessage);
      setContent('');
    } finally {
      setLoading(false);
    }

  }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload image</p>

        <input onChange={(e) => setInput(e.target.files[0])} accept='image/*' type="file" className='w-full cursor-pointer  text-gray-600 p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' />

        <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formats</p>
        <p className='text-xs text-[#FF4938] font-light mt-1'>Please upload a clear image for best results</p>


        <button
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#F6AB41] to-[#ff4938] text-white px-4 py-2 mt-6 text-sm rounded-lg ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}>
          {loading ?
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Eraser className='w-5' />}
          Remove Background
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>

        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Processed image</h1>
        </div>
        {content ? (
          <img className='w-full h-full mt-3'
            src={content} alt="image" />
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
        )

        }

      </div >
    </div >
  )
}

export default RemoveBg