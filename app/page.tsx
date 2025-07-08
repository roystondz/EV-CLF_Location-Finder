/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const  Page= () => {
  return (
    <main className=''>
        <div className=' flex flex-col items-center justify-center mt-5'>
            <h1 className='text-black text-3xl text-shadow-black font-extrabold'>EV Station Locator</h1>
            <h2 className='text-xl text-blue-500'>Using Dijkstra's, A*, Genetic Algorithm & Machine Learning to find the perfect station</h2>
        </div>
        <div className='location-entry flex flex-col items-start justify-center border border-black rounded-lg'>
          <h1 className='text-2xl font-bold text-black'>📍 Enter your Location</h1>
        </div>
        <div>

        </div>
    </main>
  )
}

export default Page;