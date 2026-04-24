/**
 * 
 * 素材资源库组件
 * 展示用户的素材和模型信息
 */
import React from 'react';

/**
 * 素材资源库函数组件
 * @returns 素材资源库的UI结构
 */
const MaterialLibrary: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">素材资源库</h3>
        </div>
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">进入库 &gt;</a>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">#Cyberpunk.LoRA</span>
        <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">#电影灯光</span>
        <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">#4K文本预设</span>
        <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">#矢量插画</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>已收藏模型: 42</span>
        <span>私有素材: 1.2GB</span>
      </div>
    </div>
  );
};

export default MaterialLibrary;