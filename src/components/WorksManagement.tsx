/**
 * 作品管理中心组件
 * 展示用户的作品和项目信息
 */
import React from 'react';

/**
 * 作品管理中心函数组件
 * @returns 作品管理中心的UI结构
 */
const WorksManagement: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">作品管理中心</h3>
        </div>
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">管理全部 &gt;</a>
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="w-1/3">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=woodworking%20workshop%20scene&image_size=square" alt="作品1" className="w-full h-20 object-cover rounded-md" />
        </div>
        <div className="w-1/3">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=woodworking%20workshop%20scene&image_size=square" alt="作品2" className="w-full h-20 object-cover rounded-md" />
        </div>
        <div className="w-1/3">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=woodworking%20workshop%20scene&image_size=square" alt="作品3" className="w-full h-20 object-cover rounded-md" />
        </div>
      </div>
      <p className="text-gray-500 text-sm">最近更新: 12分钟前 · 238个项目</p>
    </div>
  );
};

export default WorksManagement;