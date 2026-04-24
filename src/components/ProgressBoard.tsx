/**
 * 生成进度看板组件
 * 展示AI生成任务的进度和状态
 */
import React from 'react';

/**
 * 生成进度看板函数组件
 * @returns 生成进度看板的UI结构
 */
const ProgressBoard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">生成进度看板</h3>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900">任务 #0942 (4K Video)</span>
          <span className="text-sm font-medium text-blue-600">82%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">批处理: 城市人像 (12张)</p>
        <p className="text-sm text-green-600 mt-1">排队中</p>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>云端集群状态: 运行良好 · 延迟 12ms</span>
      </div>
    </div>
  );
};

export default ProgressBoard;