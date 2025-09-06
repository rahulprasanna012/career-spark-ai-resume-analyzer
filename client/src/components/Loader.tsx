import React from 'react'

const Loader = () => {
  return (
    <div className='h-screen'>
        <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* ring spinner */}
        <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <h2 className="mt-6 text-xl font-semibold text-gray-800">Analyzing Resume</h2>
        <p className="mt-2 text-sm text-gray-500">
          Our AI is processing your resume and generating insights...
        </p>
      </div>

    </div>
    
  )
}

export default Loader