import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostList from './components/PostList';
import PostDetails from './components/PostDetails';

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex p-6 gap-4">
          <PostList />
        </div>
      </div>
    </div>
  );
}

export default App;