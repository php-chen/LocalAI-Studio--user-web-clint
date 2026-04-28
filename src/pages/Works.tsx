/**
 * 作品中心页面
 * 功能：用户可以查看、管理、筛选和下载自己的所有创作作品
 */
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api';
import { message, Modal, Spin, Select, Input } from 'antd';

// API基础URL
const isProduction = import.meta.env.PROD;

const PROD_API_URL = 'http://103.236.97.248:60490';
const DEV_API_URL = '/api';

const API_BASE_URL = isProduction ? PROD_API_URL : DEV_API_URL;

// 作品类型
type CreationType = 'TEXT' | 'VIDEO' | 'IMAGE' | 'COPYWRITING' | 'OTHER';

// 作品状态
 type WorkStatus = 'QUEUING' | 'CREATING' | 'COMPLETED' | 'CANCELED' | 'FAILED' | 'INVALID';

/**
 * 作品数据类型
 */
interface WorkItem {
  id?: number;               // 作品内部ID
  work_id: string;           // 作品外部ID
  content: string;           // 提示词内容
  status: WorkStatus;        // 作品状态
  result_info?: string[];     // 生成结果路径
  extra_info?: string;        // 额外信息
  created_at: number;         // 创建时间
  models?: (string | number)[]; // 使用的模型ID
  points_consumed?: number;   // 消耗积分
  creation_type: CreationType; // 创作类型
  tags?: string[];            // 作品标签
  user_uuid?: string;         // 用户UUID
  updated_at?: number;         // 更新时间
  is_deleted?: number;         // 是否删除
}

/**
 * 作品中心函数组件
 * @returns 作品中心页面的UI结构
 */
const Works: React.FC = () => {
  // 状态管理
  const [works, setWorks] = useState<WorkItem[]>([]);          // 作品列表
  const [loading, setLoading] = useState<boolean>(true);        // 加载状态
  const [selectedType, setSelectedType] = useState<string>('all'); // 选中的作品类型
  const [searchQuery, setSearchQuery] = useState<string>('');   // 搜索查询
  const [currentPage, setCurrentPage] = useState<number>(1);    // 当前页码
  const [pageSize, setPageSize] = useState<number>(20);         // 每页数量
  const [total, setTotal] = useState<number>(0);                // 总作品数
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // 预览Modal可见性
  const [previewContent, setPreviewContent] = useState<string>(''); // 预览内容
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image'); // 预览类型

  /**
   * 获取作品列表
   * 描述：从API获取用户的作品列表，支持类型筛选和搜索
   */
  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.uuid) {
        message.error('用户未登录');
        setLoading(false);
        return;
      }

      const params: any = {
        user_uuid: user.uuid,
        page: currentPage,
        page_size: pageSize
      };

      // 添加类型筛选
      if (selectedType !== 'all') {
        params.creation_type = selectedType;
      }

      // 添加搜索查询（如果有）
      if (searchQuery) {
        // 这里可以根据API的搜索实现方式进行调整
        // 假设API支持通过content字段搜索
        // params.content = searchQuery;
      }

      const response = await api.post('/work/list', params);
      if (response.data.state === 200) {
        const workList: WorkItem[] = response.data.data.list || [];
        setWorks(workList);
        setTotal(response.data.data.total || 0);
      } else {
        message.warning('获取作品列表失败: ' + response.data.message);
      }
    } catch (error) {
      message.error('获取作品列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedType, searchQuery]);

  /**
   * 初始加载数据
   * 描述：组件挂载时加载作品列表
   */
  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  /**
   * 处理类型筛选
   * 描述：当用户选择不同的作品类型时，重新加载作品列表
   * @param type 作品类型
   */
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1); // 重置到第一页
  };

  /**
   * 处理搜索
   * 描述：当用户输入搜索关键词时，重新加载作品列表
   * @param e 输入事件
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * 处理搜索提交
   * 描述：当用户按下回车键时，执行搜索
   * @param e 键盘事件
   */
  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setCurrentPage(1); // 重置到第一页
      fetchWorks();
    }
  };

  /**
   * 处理分页变化
   * 描述：当用户切换页码时，重新加载作品列表
   * @param page 页码
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * 处理作品点击
   * 描述：点击作品时打开预览Modal
   * @param work 作品对象
   */
  const handleWorkClick = (work: WorkItem) => {
    if (work.result_info && work.result_info.length > 0) {
      const firstResult = work.result_info[0];
      setPreviewContent(`${API_BASE_URL}${firstResult}`);
      setPreviewType(work.creation_type === 'VIDEO' ? 'video' : 'image');
      setPreviewVisible(true);
    }
  };

  /**
   * 处理作品下载
   * 描述：下载作品到本地
   * @param work 作品对象
   */
  const handleWorkDownload = async (work: WorkItem) => {
    if (!work.result_info || work.result_info.length === 0) {
      message.warning('作品暂无结果');
      return;
    }

    try {
      const firstResult = work.result_info[0];
      const url = `${API_BASE_URL}${firstResult}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `work_${work.work_id}_${Date.now()}.${work.creation_type === 'VIDEO' ? 'mp4' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      message.success('作品下载成功');
    } catch (error) {
      message.error('作品下载失败');
      console.error('作品下载失败:', error);
    }
  };

  /**
   * 处理作品删除
   * 描述：删除作品
   * @param work 作品对象
   */
  const handleWorkDelete = async (work: WorkItem) => {
    if (!work.id) {
      message.warning('作品ID不存在');
      return;
    }

    try {
      const response = await api.post('/work/delete', {
        id: work.id
      });
      if (response.data.state === 200) {
        message.success('作品删除成功');
        // 重新加载作品列表
        fetchWorks();
      } else {
        message.error('作品删除失败: ' + response.data.message);
      }
    } catch (error) {
      message.error('作品删除失败，请检查网络连接');
    }
  };

  /**
   * 格式化时间
   * 描述：将时间戳格式化为可读的时间字符串
   * @param timestamp 时间戳（毫秒）
   * @returns 格式化后的时间字符串
   */
  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 获取作品类型显示名称
   * 描述：根据作品类型返回显示名称
   * @param type 作品类型
   * @returns 显示名称
   */
  const getTypeDisplayName = (type: CreationType) => {
    const typeMap: Record<CreationType, string> = {
      TEXT: '文本',
      VIDEO: '视频',
      IMAGE: '图像',
      COPYWRITING: '文案',
      OTHER: '其他'
    };
    return typeMap[type] || type;
  };

  /**
   * 获取作品类型颜色
   * 描述：根据作品类型返回对应的颜色
   * @param type 作品类型
   * @returns 颜色类名
   */
  const getTypeColor = (type: CreationType) => {
    const colorMap: Record<CreationType, string> = {
      TEXT: 'bg-blue-600',
      VIDEO: 'bg-green-600',
      IMAGE: 'bg-purple-600',
      COPYWRITING: 'bg-yellow-600',
      OTHER: 'bg-gray-600'
    };
    return colorMap[type] || 'bg-gray-600';
  };

  /**
   * 获取作品状态显示名称
   * 描述：根据作品状态返回显示名称
   * @param status 作品状态
   * @returns 显示名称
   */
  const getStatusDisplayName = (status: WorkStatus) => {
    const statusMap: Record<WorkStatus, string> = {
      QUEUING: '排队中',
      CREATING: '创作中',
      COMPLETED: '已完成',
      CANCELED: '已取消',
      FAILED: '失败',
      INVALID: '无效'
    };
    return statusMap[status] || status;
  };

  /**
   * 获取作品状态颜色
   * 描述：根据作品状态返回对应的颜色
   * @param status 作品状态
   * @returns 颜色类名
   */
  const getStatusColor = (status: WorkStatus) => {
    const colorMap: Record<WorkStatus, string> = {
      QUEUING: 'text-amber-600',
      CREATING: 'text-blue-600',
      COMPLETED: 'text-green-600',
      CANCELED: 'text-red-600',
      FAILED: 'text-red-600',
      INVALID: 'text-red-600'
    };
    return colorMap[status] || 'text-gray-600';
  };

  /**
   * 获取作品缩略图
   * 描述：根据作品类型和结果信息返回缩略图URL
   * @param work 作品对象
   * @returns 缩略图URL
   */
  const getWorkThumbnail = (work: WorkItem) => {
    if (work.result_info && work.result_info.length > 0) {
      return `${API_BASE_URL}${work.result_info[0]}`;
    }
    // 返回默认缩略图
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(work.creation_type === 'VIDEO' ? 'video thumbnail' : 'image thumbnail')}&image_size=landscape_16_9`;
  };

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
                <Input
                  type="text"
                  placeholder="搜索提示词..."
                  className="border border-gray-200 rounded-md px-4 py-2 text-sm w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={handleSearchSubmit}
                />
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                批量导出
              </button>
            </div>
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap space-x-4 mb-6">
            <button 
              onClick={() => handleTypeChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedType === 'all' 
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              全部作品 ({total})
            </button>
            <button 
              onClick={() => handleTypeChange('IMAGE')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedType === 'IMAGE' 
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              AI 图像
            </button>
            <button 
              onClick={() => handleTypeChange('VIDEO')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedType === 'VIDEO' 
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              AI 视频
            </button>
            <button 
              onClick={() => handleTypeChange('TEXT')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedType === 'TEXT' 
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              文本
            </button>
            <button 
              onClick={() => handleTypeChange('COPYWRITING')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedType === 'COPYWRITING' 
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              文案
            </button>
          </div>

          {/* 作品网格 */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" tip="加载中..." />
            </div>
          ) : works.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {works.map((work) => (
                <div key={work.work_id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={getWorkThumbnail(work)}
                      alt={work.content}
                      className="w-full aspect-video object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleWorkClick(work)}
                    />
                    <div className={`absolute top-2 left-2 ${getTypeColor(work.creation_type)} text-white text-xs px-2 py-1 rounded`}>
                      {getTypeDisplayName(work.creation_type)}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {getStatusDisplayName(work.status)}
                    </div>
                    <div className="absolute bottom-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleWorkDownload(work)}
                        className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
                        title="下载作品"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleWorkDelete(work)}
                        className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
                        title="删除作品"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 truncate" title={work.content}>
                      {work.content}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{formatTime(work.created_at)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{work.points_consumed || 0} 积分</span>
                      <span className={`text-xs font-medium ${getStatusColor(work.status)}`}>
                        {getStatusDisplayName(work.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无作品</h3>
              <p className="text-sm text-gray-500">您还没有创作任何作品，去创作中心开始吧</p>
            </div>
          )}

          {/* 分页 */}
          {!loading && works.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                  className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50"
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* 页码按钮 */}
                {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1).slice(0, 5).map((page) => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                      currentPage === page 
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {Math.ceil(total / pageSize) > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button 
                      onClick={() => handlePageChange(Math.ceil(total / pageSize))}
                      className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      {Math.ceil(total / pageSize)}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handlePageChange(currentPage < Math.ceil(total / pageSize) ? currentPage + 1 : currentPage)}
                  className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50"
                  disabled={currentPage === Math.ceil(total / pageSize)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 预览Modal */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="relative">
          {previewType === 'image' ? (
            <img
              src={previewContent}
              alt="预览图片"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <video
              src={previewContent}
              alt="预览视频"
              className="w-full h-auto max-h-[80vh] object-contain"
              controls
            />
          )}
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = previewContent;
              link.download = `preview_${Date.now()}.${previewType === 'video' ? 'mp4' : 'png'}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              message.success('下载成功');
            }}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
            title="下载"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Works;