import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function RemoveObject() {

  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const getImageUrl = (url) => {
    const ext = url.split('.').pop().split('?')[0];
    return url.replace(
      "/upload/",
      `/upload/fl_attachment:downloaded_image/`
    );
  }


  const onSubmitHandler = async (e) => {

    e.preventDefault();

    try {
      setLoading(true);

      if (object.split(' ').length > 1) {
        return toast.error("Please enter only single object name");
      }

      if (!object.trim()) {
        return toast.error("Please enter object name to remove");
      }

      if (!input) {
        return toast.error("Please upload an image");
      }

      setContent('');

      const formdata = new FormData()
      formdata.append('image', input)
      formdata.append('object', object)

      const response = await axios.post('/api/v1/ai/remove-image-object',
        formdata,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      console.log(response.data);

      if (response.data.success && response.data.data) {
        setContent(response.data.data);
        toast.success('Object removed successfully!');
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove object';
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
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload image</p>

        <input onChange={(e) => setInput(e.target.files[0])} accept='image/*' type="file" className='w-full cursor-pointer  text-gray-600 p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' />

        <p className='text-xs text-[#4A7AFF] font-light mt-1'>Please upload a clear image for best results</p>
        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>

        <textarea rows={4} onChange={(e) => setObject(e.target.value)} value={object} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='e.g., watch or spoon, only single object name' required />


        <button disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}'`}>
          {loading ?
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            :
            <Scissors className='w-5' />
          }
          Remove object
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>

        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full'>
            <img src={content} alt="image" className='h-full w-full mt-3' />
            <button
              onClick={() => {
                const downloadUrl = getImageUrl(content);
                window.location.href = downloadUrl;
              }}
              className="  my-2 px-5 py-2 bg-green-500 cursor-pointer text-white font-medium rounded-lg shadow hover:bg-primary transition"
            >
              Download Image
            </button>
          </div>
        )}


      </div>
    </div>
  )
}

export default RemoveObject