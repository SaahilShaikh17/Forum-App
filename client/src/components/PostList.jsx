import React from 'react';
import { Link } from 'react-router-dom';

const PostList = () =>{
  const posts = [
    {
      title: "This pipeline will be the death of me",
      tags: ["DevOps", "Jenkins", "Deo"],
      author: "Saahil Shaikh",
      views: 65,
      likes: 3645,
      comments: 5,
    },
    {
      title: "The 4-step SEO framework that led to 1000% traffic growth",
      tags: ["seo", "blogging", "traffic"],
      author: "AR Jakir",
      views: 244564,
      likes: 10920,
      comments: 184,
    },
  ];

  return(
    <div className='flex-1 space-y-6'>
      {posts.map((post,index) => (
        <div key={index} className='bg-gray-800 p-4 rounded'>
          <h3 className='text-xl font-bold'>{post.title}</h3>
          <div className='flex space-x-2 mt-2'>
            {post.tags.map((tag)=>(
              <span key={tag} className='bg-gray-700 px-2 py-1 rounded text-sm'>
                {tag}
              </span>
            ))}
          </div>

          <p className='mt-2 text-sm text-gray-400'>
          {post.author} - {post.views} Views - {post.likes} Likes - {post.comments} Comments
          </p>
        </div>
      ))}
    </div>
  );
};
export default PostList;
