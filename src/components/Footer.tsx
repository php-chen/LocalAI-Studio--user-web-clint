/**
 * 页脚组件
 * 展示VisionAI 2026的版权信息和链接
 */
import React from 'react';

/**
 * 页脚函数组件
 * @returns 页脚的UI结构
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">VisionAI 2026</span>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-500 text-sm">© 2026 All Rights Reserved.</p>
            <a href="#" className="text-gray-600 text-sm hover:text-purple-600">隐私政策</a>
            <a href="#" className="text-gray-600 text-sm hover:text-purple-600">服务协议</a>
            <a href="#" className="text-gray-600 text-sm hover:text-purple-600">API 开发文档</a>
            <a href="#" className="text-gray-600 text-sm hover:text-purple-600">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;