/**
 * 页脚组件
 * 展示VisionAI 2026的版权信息和链接
 */
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 页脚函数组件
 * @returns 页脚的UI结构
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-38 px-10 h-8 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">CXF-AI</span>
            </div>
            <span className="text-xl font-bold text-gray-900"></span>
          </Link>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6">
            <span className="text-gray-500 text-sm">© cxf All Rights Reserved.</span>
            <a href="/#/privacy" className="text-gray-600 text-sm hover:text-purple-600">隐私政策</a>
            <a href="/#/agreement" className="text-gray-600 text-sm hover:text-purple-600">服务协议</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;