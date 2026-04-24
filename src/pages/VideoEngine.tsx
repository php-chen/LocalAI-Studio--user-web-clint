/**
 * 视频引擎页面
 */
import React from 'react';
import MainLayout from '../layouts/MainLayout';

/**
 * 视频引擎函数组件
 * @returns 视频引擎页面的UI结构
 */
const VideoEngine: React.FC = () => {
  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          {/* 左侧视频创作参数面板 */}
          <div className="w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">视频创作参数面板</h2>

            {/* 模型选择 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">核心模型选择</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-blue-200 rounded-lg p-2 bg-blue-50">
                  <div className="aspect-square bg-blue-100 rounded-md mb-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900 text-center">Cinematic Pro</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-2">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900 text-center">Motion Gen</p>
                </div>
              </div>
            </div>

            {/* 提示词输入 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">视频描述 (PROMPT)</h3>
                <span className="text-xs text-gray-500">高级模式</span>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-md p-2 text-sm"
                placeholder="例如: 一个身穿未来科技服装的少女在城市中漫步，镜头跟随移动，超高清，8k分辨率..."
                rows={4}
              ></textarea>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0/313</span>
                <span>取消搜索</span>
                <span>标点优化</span>
              </div>
            </div>

            {/* 视频参数设置 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">视频参数设置</h3>

              {/* 视频时长 */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">视频时长</span>
                  <span className="text-xs text-gray-500">15秒</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  defaultValue="15"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5秒</span>
                  <span>30秒</span>
                  <span>60秒</span>
                </div>
              </div>

              {/* 分辨率 */}
              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-600 mb-2">分辨率</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border border-blue-200 rounded-md p-2 text-xs bg-blue-50 text-blue-600">1080p (HD)</button>
                  <button className="border border-gray-200 rounded-md p-2 text-xs">4K (UHD)</button>
                </div>
              </div>

              {/* 帧率 */}
              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-600 mb-2">帧率</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button className="border border-gray-200 rounded-md p-2 text-xs">24fps</button>
                  <button className="border border-blue-200 rounded-md p-2 text-xs bg-blue-50 text-blue-600">30fps</button>
                  <button className="border border-gray-200 rounded-md p-2 text-xs">60fps</button>
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">
              立即生成视频 (消耗 20 算力)
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">正在生成您的视频...</h3>
              <p className="text-sm text-gray-500 mb-6">预计剩余时间: 45 秒 (当前队列: 1)</p>

              {/* 视频预览 */}
              <div className="w-full aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* 视频片段预览 */}
              <div className="flex space-x-2 mt-6">
                <div className="w-16 h-10 border border-blue-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20scene%20future&image_size=square" alt="视频片段1" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-10 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20scene%20future&image_size=square" alt="视频片段2" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-10 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20scene%20future&image_size=square" alt="视频片段3" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-10 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20scene%20future&image_size=square" alt="视频片段4" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-10 border border-gray-200 rounded-md overflow-hidden">
                  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20scene%20future&image_size=square" alt="视频片段5" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧生成状态面板 */}
          <div className="w-1/4">
            {/* 生成状态面板 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                生成状态面板
              </h2>

              {/* 任务列表 */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">#1284 未来城市...</span>
                    <span className="text-xs text-gray-500">剩余45秒</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">#1283 自然风景...</span>
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
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>可用</span>
                <span>45%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default VideoEngine;