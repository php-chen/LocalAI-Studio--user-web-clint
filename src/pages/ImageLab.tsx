/**
 * 图像实验室页面
 */
import React from 'react';
import MainLayout from '../layouts/MainLayout';

/**
 * 图像实验室函数组件
 * @returns 图像实验室页面的UI结构
 */
const ImageLab: React.FC = () => {
  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          {/* 左侧创作参数面板 */}
          <div className="w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创作参数面板</h2>

            {/* 模型选择 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">核心模型选择</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-purple-200 rounded-lg p-2 bg-purple-50">
                  <div className="aspect-square bg-blue-100 rounded-md mb-2 flex items-center justify-center">
                    <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=house%20model%20blue%20background&image_size=square" alt="Vision Art 4.0" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 text-center">Vision Art 4.0</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-2">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=house%20model%20brown%20background&image_size=square" alt="Cinematic 500D" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 text-center">Cinematic 500D</p>
                </div>
              </div>
            </div>

            {/* 提示词输入 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">提示词 (PROMPT)</h3>
                <span className="text-xs text-gray-500">高级模式</span>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-md p-2 text-sm"
                placeholder="例如: 一个身穿哥特式服装的少女走在2026年的霓虹灯街道，超高清，8k分辨率..."
                rows={4}
              ></textarea>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0/313</span>
                <span>取消搜索</span>
                <span>标点优化</span>
              </div>
            </div>

            {/* 负面词输入 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">负面词</h3>
              <textarea
                className="w-full border border-gray-200 rounded-md p-2 text-sm"
                placeholder="例如: 模糊，变形，低质量..."
                rows={2}
              ></textarea>
            </div>

            {/* 图像比例 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">图像比例 (ASPECT RATIO)</h3>
              <div className="flex space-x-2">
                <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-xs">1:1</button>
                <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-xs">4:3</button>
                <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-xs">16:9</button>
              </div>
            </div>

            {/* 生成按钮 */}
            <button className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700">
              立即生成作品 (消耗 5 算力)
            </button>
          </div>

          {/* 中间主面板 */}
          <div className="w-2/4 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">正在构思您的艺术作品...</h3>
              <p className="text-sm text-gray-500 mb-6">预计剩余时间: 12 秒 (当前队列: 2)</p>

              {/* 生成的图片预览 */}
              <div className="flex space-x-2 mt-6">
                <div className="w-20 h-20 border border-purple-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20scene%20blue%20sky&image_size=square" alt="生成图片1" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20scene%20blue%20sky&image_size=square" alt="生成图片2" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20scene%20blue%20sky&image_size=square" alt="生成图片3" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20scene%20blue%20sky&image_size=square" alt="生成图片4" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧生成状态面板 */}
          <div className="w-1/4">
            {/* 生成状态面板 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                生成状态面板
              </h2>

              {/* 任务列表 */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">#0942 庭院艺术...</span>
                    <span className="text-xs text-gray-500">剩余12秒</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">#0941 自然摄影...</span>
                    <span className="text-xs text-gray-500">排队中</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* GPU算力进度 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">GPU 算力进度</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>可用</span>
                <span>65%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default ImageLab;