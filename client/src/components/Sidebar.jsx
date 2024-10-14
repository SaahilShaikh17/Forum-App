import React from 'react';

const Sidebar = () =>{
  return(
    <div className='w-64 bg-gray-800 p-6'>
      <h2 className='text-lg font-bold mb-4'>Popular Tags</h2>
      <ul className='space-y-3'>
        {["#javascript","#bitcoin","#design","#innovation","#tutorial"].map((tag) =>(
          <li key={tag} className='hover:bg-gray-700 p-2 rounded'>
            {tag}
          </li>
        ))}
        
      </ul>
    </div>
  );
}

export default Sidebar;