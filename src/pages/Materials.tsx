/**
 * 素材库页面
 */
import React from 'react';
import MainLayout from '../layouts/MainLayout';

/**
 * 素材数据类型
 */
interface MaterialItem {
  id: string;
  name: string;
  type: string;
  size: string;
  thumbnail: string;
  isFavorite: boolean;
}

/**
 * 素材库函数组件
 * @returns 素材库页面的UI结构
 */
const Materials: React.FC = () => {
  // 模拟素材数据
  const materials: MaterialItem[] = [
    {
      id: '1',
      name: '油画风格 LoRA',
      type: 'LoRA',
      size: '1.2MB',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20forest%20scene%20with%20wooden%20sign&image_size=square',
      isFavorite: true
    },
    {
      id: '2',
      name: '复古电影预设',
      type: '预设',
      size: '1.2MB',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20forest%20scene%20with%20wooden%20sign&image_size=square',
      isFavorite: false
    },
    {
      id: '3',
      name: '森林风光 8K',
      type: '图片',
      size: '4.2MB',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20forest%20scene%20with%20wooden%20sign&image_size=square',
      isFavorite: false
    },
    {
      id: '4',
      name: '雨中城市素材',
      type: '图片',
      size: '1.8MB',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20forest%20scene%20with%20wooden%20sign&image_size=square',
      isFavorite: false
    },
    {
      id: '5',
      name: '人物肖像 LoRA',
      type: 'LoRA',
      size: '2.1MB',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20forest%20scene%20with%20wooden%20sign&image_size=square',
      isFavorite: false
    },
    {
      id: '6',
      name: '未来建筑 LoRA',
      type: 'LoRA',
      size: '1.9MB',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20forest%20scene%20with%20wooden%20sign&image_size=square',
      isFavorite: false
    }
  ];

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          {/* 左侧导航栏 */}
          <div className="w-1/6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">素材库</h2>
              <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700">
                + 上传素材
              </button>
            </div>

            <nav>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-purple-50 text-purple-600 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>我的收藏</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>图片素材</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>视频片段</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>LoRA模型库</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>提示词预设</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>回收站</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* 右侧内容区 */}
          <div className="w-5/6">
            {/* 顶部操作栏 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">我的收藏 (42个项)</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>网格视图</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>列表视图</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 素材网格 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {materials.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src={material.thumbnail}
                        alt={material.name}
                        className="w-full aspect-video object-cover"
                      />
                      <button className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${material.isFavorite ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-400 hover:bg-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill={material.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{material.name}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{material.type}</span>
                        <span>{material.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 拖放区域 */}
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">将文件拖到此处开始上传</h3>
              <p className="text-sm text-gray-500 mb-4">支持 PNG, JPG, MP4, WEBM 等格式</p>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                选择文件
              </button>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Materials;