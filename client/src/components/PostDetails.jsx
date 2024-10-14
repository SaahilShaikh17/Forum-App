import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetails = ({ posts }) => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
      <hr className="my-4" />
      <h3 className="font-bold">Comments</h3>
      <ul>
        {post.comments.map((comment, index) => (
          <li key={index} className="border-t py-2">
            <p>{comment.text}</p>
            <small>by {comment.author}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetails;
