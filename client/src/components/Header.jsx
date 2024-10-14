import React from 'react';

const Header = () => {
  return(
    <div className='flex items-center justify-between bg-gray-800 p-4'>
      <h1 className='text-2xl font-bold'>Pipeline of Doom</h1>
      <div className='flex items-center space-x-4'>
        <input type="text"
        placeholder='Search'
        className='px-4 py-2 rounded bg-gray-700 text-white outline-none'
        />

        <button className='bg-orange-500 px-4 py-2 rounded'>Create Post</button>
      </div>
    </div>
  );
};

export default Header;