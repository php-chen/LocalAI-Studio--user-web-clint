import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logout } from '../api';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout: handleLogout } = useAuthStore();

  const handleLogoutClick = async () => {
    try {
      await logout();
      handleLogout();
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <div className="w-38 px-10 h-8 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">CXF-AI</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`font-medium pb-4 ${location.pathname === '/' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>门户首页</Link>
            <Link to="/image-lab" className={`font-medium pb-4 ${location.pathname === '/image-lab' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>图像实验室</Link>
            <Link to="/video-engine" className={`font-medium pb-4 ${location.pathname === '/video-engine' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>视频引擎</Link>
            <Link to="/works" className={`font-medium pb-4 ${location.pathname === '/works' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>作品中心</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">

          
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{user?.account?.charAt(0)?.toUpperCase() || 'A'}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogoutClick}
                  className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1 border border-gray-300 rounded-md hover:border-purple-600"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1 border border-gray-300 rounded-md hover:border-purple-600"
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;