/**
 * 流行风格推荐组件
 * 展示2026年4月流行的AI创作风格
 */
import React from 'react';

// 风格数据类型
interface StyleItem {
  id: string;
  name: string;
  tags: string;
  imageUrl: string;
}

/**
 * 流行风格推荐函数组件
 * @returns 流行风格推荐的UI结构
 */
const StyleRecommendation: React.FC = () => {
  // 风格数据
  const styles: StyleItem[] = [
    {
      id: '1',
      name: '梦幻写实 v3.0',
      tags: '摄影 · 超写实',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20of%20a%20person%20wearing%20orange%20shirt%20and%20sunglasses%20dark%20background&image_size=square'
    },
    {
      id: '2',
      name: '赛博霓虹 2026',
      tags: '概念艺术 · 潮流',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20of%20a%20person%20wearing%20orange%20shirt%20and%20sunglasses%20dark%20background&image_size=square'
    },
    {
      id: '3',
      name: '江户绘卷 LoRA',
      tags: '动漫 · 艺术',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20of%20a%20person%20wearing%20orange%20shirt%20and%20sunglasses%20dark%20background&image_size=square'
    },
    {
      id: '4',
      name: '极简 3D 渲染',
      tags: '设计 · 产品',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20of%20a%20person%20wearing%20orange%20shirt%20and%20sunglasses%20dark%20background&image_size=square'
    },
    {
      id: '5',
      name: '梦幻写实 v3.0',
      tags: '摄影 · 超写实',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20of%20a%20person%20wearing%20orange%20shirt%20and%20sunglasses%20dark%20background&image_size=square'
    },
    {
      id: '6',
      name: '新古典主义',
      tags: '油画 · 复古',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20of%20a%20person%20wearing%20orange%20shirt%20and%20sunglasses%20dark%20background&image_size=square'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          2026年4月 流行风格推荐
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {styles.map((style) => (
            <div key={style.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={style.imageUrl} 
                  alt={style.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 mb-1">{style.name}</h3>
                <p className="text-xs text-gray-500">{style.tags}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleRecommendation;