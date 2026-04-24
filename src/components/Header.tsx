import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">VisionAI 2026</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-purple-600 font-medium border-b-2 border-purple-600 pb-4">门户首页</Link>
            <Link to="/image-lab" className="text-gray-600 font-medium hover:text-purple-600 pb-4">图像实验室</Link>
            <Link to="/video-engine" className="text-gray-600 font-medium hover:text-purple-600 pb-4">视频引擎</Link>
            <Link to="/works" className="text-gray-600 font-medium hover:text-purple-600 pb-4">作品中心</Link>
            <Link to="/materials" className="text-gray-600 font-medium hover:text-purple-600 pb-4">素材库</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium">
              高级创作
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;