/**
 * 首页组件
 * 包含首页的完整布局和功能模块
 */
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import WorksManagement from '../components/WorksManagement';
import MaterialLibrary from '../components/MaterialLibrary';
import ProgressBoard from '../components/ProgressBoard';
import StyleRecommendation from '../components/StyleRecommendation';

/**
 * 首页函数组件
 * @returns 首页的完整UI结构
 */
export default function Home() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '年') + '月' + new Date().toISOString().split('T')[0].split('-')[2] + '日';

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">早上好，Creative Explorer</h1>
            <p className="text-gray-600">今天是 {today}。您的GPU算力充足，快来开启新的创作吧。</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">算力余额</p>
                <p className="text-gray-900 font-medium">14,280 ns</p>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">今日生成</p>
                <p className="text-gray-900 font-medium">42 次</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Image Lab */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium">IMAGE STUDIO V2.1</span>
                    <span className="bg-purple-800 text-white text-xs px-2 py-0.5 rounded-full">专业版</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">AI 图像实验室</h2>
                  <p className="text-purple-100 mb-6">支持 SDXL、Midjourney 2026 风格体系，内置图像修复与增强 ControlNet 权重控制，让每一张像素都符合您的想象。</p>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium flex items-center space-x-2 hover:bg-purple-50">
                    <span>立即开始</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs">1</div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs">2</div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs">+</div>
                </div>
              </div>
            </div>
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20female%20warrior%20with%20wings%20purple%20background&image_size=landscape_16_9')` }}>
            </div>
          </div>

          {/* AI Video Engine */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-300 font-medium">CINEMA ENGINE PRO</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Studio</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">AI 视频生成引擎</h2>
                  <p className="text-gray-400 mb-6">4K 60fps 级超引擎架构，支持镜头推位位移、动态构图与节奏同步。下一步大片，从这一段文本开始。</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 hover:bg-blue-700">
                    <span>进入引擎</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                  已上线 24+ 小时
                </div>
              </div>
            </div>
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cinematic%20scene%20dark%20background&image_size=landscape_16_9')` }}>
            </div>
          </div>
        </div>

        {/* Additional Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <WorksManagement />
          <MaterialLibrary />
          <ProgressBoard />
        </div>
      </main>

      {/* Style Recommendation */}
      <StyleRecommendation />
    </MainLayout>
  );
}