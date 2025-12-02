import { Hash, Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function GenerateImages() {

  const imageStyle = ['Photorealistic', 'Cartoon', '3D Render', 'Pixel Art', 'Line Art', 'Watercolor', 'Oil Painting', 'Surreal', 'Fantasy', 'Cyberpunk']

  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
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

    if (!input.trim()) {
      toast.error('Please enter a topic');
      return;
    }


    try {
      setLoading(true);
      console.log("Calling:", axios.defaults.baseURL + "/api/v1/ai/generate-image");
      setContent('');
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`

      const response = await axios.post('/api/v1/ai/generate-image', {
        prompt,
        publish,
      },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      console.log(response.data);

      if (response.data.success && response.data.data) {
        setContent(response.data.data);
        toast.success('Image generated successfully!');
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate image';
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
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe your image</p>

        <textarea rows={4} onChange={(e) => setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Tell your imagination' required />

        <p className='mt-4 text-sm font-medium'>Style</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyle.map((item) => (
            <span onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-50 text-green-700' :
                'text-gray-500 border-gray-300'}`} key={item}>{item}</span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" onChange={(e) => setPublish(e.target.checked)}
              checked={publish} className='sr-only peer' />

            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>

            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image Public</p>
        </div>

        <button
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
          {loading ?
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :
            <Image className='w-5' />
          }
          Generate Image
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>

        <div className='flex items-center gap-3'>
          <image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Image className='w-9 h-9' />
              <p>Enter a topic and click "Generate Image " to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full '>
            <img src={content} alt="image" className='w-full h-full' />
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

export default GenerateImages