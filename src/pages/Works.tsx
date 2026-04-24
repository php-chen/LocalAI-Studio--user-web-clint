/**
 * 作品中心页面
 */
import React from 'react';
import MainLayout from '../layouts/MainLayout';

/**
 * 素材数据类型
 */
interface WorkItem {
  id: string;
  title: string;
  date: string;
  type: 'image' | 'video';
  model: string;
  resolution: string;
  thumbnail: string;
  duration?: string;
}

/**
 * 作品中心函数组件
 * @returns 作品中心页面的UI结构
 */
const Works: React.FC = () => {
  // 模拟作品数据
  const works: WorkItem[] = [
    {
      id: '1',
      title: '霓虹雨夜下的流浪者',
      date: '2026-04-22 10:24',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '2',
      title: '星际迷航：发现号',
      date: '2026-04-21 22:15',
      type: 'video',
      model: 'Gen-3 Pro',
      resolution: '4K 60fps',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square',
      duration: '00:15'
    },
    {
      id: '3',
      title: '作品3',
      date: '2026-04-20 15:45',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '1:1',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '4',
      title: '作品4',
      date: '2026-04-19 09:30',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '5',
      title: '作品5',
      date: '2026-04-18 14:20',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '6',
      title: '作品6',
      date: '2026-04-17 11:15',
      type: 'video',
      model: 'Gen-3 Pro',
      resolution: '1080p 30fps',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square',
      duration: '00:10'
    },
    {
      id: '7',
      title: '作品7',
      date: '2026-04-16 16:45',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '8',
      title: '作品8',
      date: '2026-04-15 10:30',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '9',
      title: '作品9',
      date: '2026-04-14 13:20',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    },
    {
      id: '10',
      title: '作品10',
      date: '2026-04-13 09:45',
      type: 'image',
      model: 'SDXL 4.0',
      resolution: '16:9',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20man%20in%20green%20clothing&image_size=square'
    }
  ];

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* 页面标题和操作 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">作品管理中心</h1>
              <p className="text-sm text-gray-500">管理、导出和分享您的所有 AI 创作</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索提示词或文件名..."
                  className="border border-gray-200 rounded-md px-4 py-2 text-sm w-64"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                批量导出
              </button>
            </div>
          </div>

          {/* 分类标签 */}
          <div className="flex space-x-4 mb-6">
            <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-md text-sm font-medium">
              全部作品 (238)
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">
              AI 图像 (192)
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">
              AI 视频 (46)
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">
              草稿箱 (12)
            </button>
          </div>

          {/* 作品网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {works.map((work) => (
              <div key={work.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full aspect-video object-cover"
                  />
                  {work.type === 'video' && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {work.duration}
                    </div>
                  )}
                  {work.type === 'image' && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      IMAGE
                    </div>
                  )}
                  {work.type === 'video' && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      VIDEO
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{work.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{work.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{work.model}</span>
                    <span className="text-xs text-gray-500">{work.resolution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-8 h-8 bg-purple-600 text-white rounded-md flex items-center justify-center">1</button>
              <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50">2</button>
              <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50">3</button>
              <span className="text-gray-500">...</span>
              <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50">12</button>
              <button className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Works;