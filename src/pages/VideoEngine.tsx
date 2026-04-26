/**
 * 视频引擎页面
 * 功能：用户可以通过文本提示词生成视频，管理创作任务，查看创作历史
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api';
import { message, Modal } from 'antd';

// 默认积分消耗值
const DEFAULT_POINTS_CONSUMED = 20;
// API基础URL
const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * AI模型接口
 * 描述：从API获取的AI模型信息
 */
interface AIModel {
  id: number;              // 模型ID
  model_name: string;      // 模型名称
  model_type: string;      // 模型类型
  config_info: any;        // 模型配置信息
  is_deleted: number;      // 是否删除
  created_at: number;      // 创建时间
  updated_at: number;      // 更新时间
  points?: number;         // 模型消耗积分
  workflow?: string;       // 工作流名称
}

/**
 * 创作任务接口
 * 描述：用户创建的视频生成任务信息
 */
interface CreationTask {
  work_id?: string;                   // 作品ID
  creation_id?: string;               // 旧的创作ID（兼容）
  content: string;                    // 任务内容（提示词）
  status: 'QUEUING' | 'CREATING' | 'COMPLETED' | 'CANCELED' | 'INVALID' | 'FAILED';  // 任务状态
  result_info?: string[];             // 生成结果路径
  extra_info?: string;                // 额外信息
  created_at?: number;                // 创建时间
  models?: (string | number)[];       // 使用的模型ID
  points_consumed?: number;           // 消耗积分
  creation_type?: string;             // 创作类型
  tags?: string[];                    // 作品标签
}

/**
 * 视频引擎组件
 * @returns 视频引擎页面的UI结构
 */
const VideoEngine: React.FC = () => {
  // 状态管理
  const [models, setModels] = useState<AIModel[]>([]);             // AI模型列表
  const [loading, setLoading] = useState<boolean>(true);           // 模型加载状态
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);  // 选中的模型ID
  const [selectedModelPoints, setSelectedModelPoints] = useState<number>(DEFAULT_POINTS_CONSUMED);  // 选中模型的积分消耗
  const [prompt, setPrompt] = useState<string>('');                // 提示词输入
  const [balance, setBalance] = useState<number>(0);              // 用户积分余额
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);  // 积分加载状态
  const [tasks, setTasks] = useState<CreationTask[]>([]);          // 创作任务列表
  const [tasksLoading, setTasksLoading] = useState<boolean>(true);  // 任务加载状态
  const [selectedTask, setSelectedTask] = useState<CreationTask | null>(null);  // 选中的任务
  const [currentCreationId, setCurrentCreationId] = useState<string | null>(null);  // 当前正在创建的任务ID
  const [isCreating, setIsCreating] = useState<boolean>(false);     // 创建任务的加载状态
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);  // 视频预览Modal的可见性
  const [previewVideo, setPreviewVideo] = useState<string>('');     // 当前预览的视频URL
  
  // 视频参数
  const [videoDuration, setVideoDuration] = useState<number>(15);   // 视频时长
  const [resolution, setResolution] = useState<string>('1080p');    // 分辨率
  const [fps, setFps] = useState<number>(30);                      // 帧率

  // 引用
  const tasksRef = useRef(tasks);  // 任务列表的引用，用于在setTimeout中访问最新状态
  tasksRef.current = tasks;

  /**
   * 获取AI模型列表
   * 描述：从API获取文本到视频的AI模型列表
   */
  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.post('/ai-model/list', {
        model_type: 'TEXT_TO_VIDEO',
        page: 1,
        page_size: 20
      });
      if (response.data.state === 200) {
        const modelList = response.data.data.list || [];
        setModels(modelList);
        // 如果有模型且未选择模型，默认选择第一个
        if (modelList.length > 0 && !selectedModelId) {
          setSelectedModelId(modelList[0].id);
          setSelectedModelPoints(modelList[0].points || DEFAULT_POINTS_CONSUMED);
        }
      } else {
        message.warning('获取模型列表失败: ' + response.data.message);
      }
    } catch (error) {
      message.error('获取模型列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, [selectedModelId]);

  /**
   * 获取用户积分余额
   * 描述：从API获取用户的积分余额
   */
  const fetchBalance = useCallback(async () => {
    try {
      setBalanceLoading(true);
      const response = await api.post('/point/balance', {});
      if (response.data.state === 200) {
        setBalance(response.data.data.balance);
      }
    } catch (error) {
      message.error('获取积分失败');
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  /**
   * 获取创作任务列表
   * 描述：从API获取用户的创作任务列表
   */
  const fetchTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.uuid) {
        message.error('用户未登录');
        return;
      }
      const response = await api.post('/work/list', {
        user_uuid: user.uuid,
        creation_type: 'VIDEO',
        page: 1,
        page_size: 20
      });
      if (response.data.state === 200) {
        const taskList: CreationTask[] = response.data.data.list || [];
        setTasks(taskList);
        // 如果有任务且未选择任务，默认选择第一个并获取详情
        if (taskList.length > 0 && !selectedTask) {
          setSelectedTask(taskList[0]);
          fetchWorkDetail(taskList[0].work_id || taskList[0].creation_id);
        }
      }
    } catch (error) {
      message.error('获取任务列表失败');
    } finally {
      setTasksLoading(false);
    }
  }, [selectedTask]);

  /**
   * 获取作品详情
   * 描述：从API获取指定作品的详细信息，包括生成结果
   * @param workId 作品ID
   */
  const fetchWorkDetail = useCallback(async (workId: string) => {
    try {
      const response = await api.post('/work/detail', {
        work_id: workId
      });
      if (response.data.state === 200) {
        const workDetail = response.data.data;
        // 更新任务列表中的任务信息
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task =>
            (task.work_id === workId || task.creation_id === workId)
              ? { ...task, ...workDetail }
              : task
          );
          return updatedTasks;
        });
        // 更新选中的任务信息
        setSelectedTask(prev => {
          if (prev?.work_id === workId || prev?.creation_id === workId) {
            return { ...prev, ...workDetail };
          }
          return prev;
        });
        // 如果作品已完成，停止轮询
        if (workDetail.status === 'COMPLETED') {
          setCurrentCreationId(null);
        }
      }
    } catch (error) {
      console.error('获取作品详情失败:', error);
    }
  }, []);

  /**
   * 初始加载数据
   * 描述：组件挂载时加载模型列表、用户积分和任务列表
   */
  useEffect(() => {
    fetchModels();
    fetchBalance();
    fetchTasks();
  }, []);

  /**
   * 轮询作品状态
   * 描述：当有正在创建的作品时，每5秒轮询一次作品状态
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentCreationId) {
      // 立即查询一次
      fetchWorkDetail(currentCreationId);
      // 每5秒查询一次
      interval = setInterval(() => {
        fetchWorkDetail(currentCreationId);
      }, 5000);
    }
    // 清理函数
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentCreationId, fetchWorkDetail]);

  /**
   * 创建作品
   * 描述：根据用户输入的提示词和选择的模型创建视频生成任务
   */
  const handleCreateWork = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // 验证用户登录状态
    if (!user.uuid) {
      message.error('请先登录');
      return;
    }
    // 验证提示词
    if (!prompt.trim()) {
      message.warning('请输入提示词');
      return;
    }
    // 验证模型选择
    if (!selectedModelId) {
      message.warning('请选择一个模型');
      return;
    }
    // 验证积分
    if (balance < selectedModelPoints) {
      message.error('积分不足，无法创建作品');
      return;
    }

    try {
      setIsCreating(true);
      const response = await api.post('/work/create', {
        points_consumed: selectedModelPoints,
        models: [selectedModelId],
        content: prompt,
        creation_type: 'VIDEO',
        extra_info: JSON.stringify({
          duration: videoDuration,
          resolution: resolution,
          fps: fps
        })
      });

      if (response.data.state === 200) {
        message.success('作品创建成功');
        const newWorkId = response.data.data.work_id;
        setCurrentCreationId(newWorkId);
        setPrompt('');

        // 更新积分和任务列表
        await fetchBalance();
        await fetchTasks();

        // 延迟选择新创建的任务
        setTimeout(() => {
          const newTask = tasksRef.current.find(t => t.work_id === newWorkId || t.creation_id === newWorkId);
          if (newTask) {
            setSelectedTask(newTask);
          }
        }, 500);
      } else {
        message.error('作品创建失败: ' + response.data.message);
      }
    } catch (error) {
      message.error('作品创建失败，请检查网络连接');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 选择任务
   * 描述：选择一个任务并获取其详细信息
   * @param task 要选择的任务
   */
  const handleTaskSelect = async (task: CreationTask) => {
    setSelectedTask(task);
    // 获取任务详情
    const taskId = task.work_id || task.creation_id;
    if (taskId) {
      await fetchWorkDetail(taskId);
      // 如果任务未完成，开始轮询状态
      if (task.status !== 'COMPLETED' && task.status !== 'CANCELED' && task.status !== 'INVALID' && task.status !== 'FAILED') {
        if (!currentCreationId || currentCreationId !== taskId) {
          setCurrentCreationId(taskId);
        }
      }
    }
  };

  /**
   * 获取状态配置
   * 描述：根据任务状态获取对应的显示配置
   * @param status 任务状态
   * @returns 状态配置对象
   */
  const getStatusConfig = (status: string) => {
    const configMap: Record<string, { label: string; color: string; progress: string }> = {
      QUEUING: { label: '排队中', color: 'text-amber-600', progress: 'bg-amber-500' },
      CREATING: { label: '创作中', color: 'text-blue-600', progress: 'bg-blue-500' },
      COMPLETED: { label: '已完成', color: 'text-green-600', progress: 'bg-green-500' },
      CANCELED: { label: '已取消', color: 'text-red-600', progress: 'bg-red-500' },
      INVALID: { label: '无效', color: 'text-red-600', progress: 'bg-red-500' },
      FAILED: { label: '失败', color: 'text-red-600', progress: 'bg-red-500' }
    };
    return configMap[status] || { label: '未知', color: 'text-gray-600', progress: 'bg-gray-400' };
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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 获取模型名称
   * 描述：根据模型ID获取模型名称
   * @param modelId 模型ID
   * @returns 模型名称
   */
  const getModelName = (modelId: string | number | undefined) => {
    if (!modelId) return '未选择';
    const model = models.find(m => m.id === (typeof modelId === 'string' ? parseInt(modelId) : modelId));
    return model?.model_name || '未知模型';
  };

  /**
   * 处理视频点击
   * 描述：点击视频时打开预览Modal
   * @param videoPath 视频路径
   */
  const handleVideoClick = (videoPath: string) => {
    setPreviewVideo(`${API_BASE_URL}${videoPath}`);
    setPreviewVisible(true);
  };

  /**
   * 处理视频下载
   * 描述：下载视频到本地
   * @param videoPath 视频路径
   */
  const handleVideoDownload = async (videoPath: string) => {
    try {
      const videoUrl = `${API_BASE_URL}${videoPath}`;
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      message.success('视频下载成功');
    } catch (error) {
      message.error('视频下载失败');
      console.error('视频下载失败:', error);
    }
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          {/* 左侧创作参数面板 */}
          <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创作参数</h2>

            {/* AI模型选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">AI 模型</label>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : models.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {models.map(model => (
                    <div
                      key={model.id}
                      onClick={() => {
                        setSelectedModelId(model.id);
                        setSelectedModelPoints(model.points || DEFAULT_POINTS_CONSUMED);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedModelId === model.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                            selectedModelId === model.id ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {model.model_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {model.points || DEFAULT_POINTS_CONSUMED} 积分
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-500">暂无可用模型</p>
                </div>
              )}
            </div>

            {/* 提示词输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                视频描述 (Prompt)
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如: 一个身穿未来科技服装的少女在城市中漫步，镜头跟随移动，超高清，8k分辨率..."
                rows={5}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={isCreating}
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {prompt.length} 字符
              </div>
            </div>

            {/* 视频参数设置 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">视频参数设置</h3>

              {/* 视频时长 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">视频时长</span>
                  <span className="text-xs text-gray-500">{videoDuration}秒</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={videoDuration}
                  onChange={e => setVideoDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isCreating}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5秒</span>
                  <span>30秒</span>
                  <span>60秒</span>
                </div>
              </div>

              {/* 分辨率 */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-600 mb-2">分辨率</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setResolution('1080p')}
                    disabled={isCreating}
                    className={`border rounded-md p-2 text-xs transition-all ${
                      resolution === '1080p' 
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    1080p (HD)
                  </button>
                  <button 
                    onClick={() => setResolution('4k')}
                    disabled={isCreating}
                    className={`border rounded-md p-2 text-xs transition-all ${
                      resolution === '4k' 
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    4K (UHD)
                  </button>
                </div>
              </div>

              {/* 帧率 */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-600 mb-2">帧率</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setFps(24)}
                    disabled={isCreating}
                    className={`border rounded-md p-2 text-xs transition-all ${
                      fps === 24 
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    24fps
                  </button>
                  <button 
                    onClick={() => setFps(30)}
                    disabled={isCreating}
                    className={`border rounded-md p-2 text-xs transition-all ${
                      fps === 30 
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    30fps
                  </button>
                  <button 
                    onClick={() => setFps(60)}
                    disabled={isCreating}
                    className={`border rounded-md p-2 text-xs transition-all ${
                      fps === 60 
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    60fps
                  </button>
                </div>
              </div>
            </div>

            {/* 积分信息 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">消耗积分</span>
                <span className="font-medium text-blue-600">{selectedModelPoints} 积分</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">剩余积分</span>
                <span className="font-medium text-blue-600">{balance} 积分</span>
              </div>
            </div>

            {/* 创建按钮 */}
            <button
              onClick={handleCreateWork}
              disabled={isCreating || balance < selectedModelPoints}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isCreating || balance < selectedModelPoints
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isCreating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  创建中...
                </span>
              ) : (
                '开始创作'
              )}
            </button>

            {/* 积分不足提示 */}
            {balance < selectedModelPoints && (
              <p className="mt-2 text-xs text-red-500 text-center">积分不足，请先充值</p>
            )}
          </div>

          {/* 中间作品预览面板 */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[600px]">
            {selectedTask ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">作品预览</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedTask.status).color} bg-opacity-10`}
                        style={{ backgroundColor: `${getStatusConfig(selectedTask.status).color.replace('text-', '')}15` }}>
                    {getStatusConfig(selectedTask.status).label}
                  </span>
                </div>

                {/* 任务信息 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">提示词</span>
                      <p className="font-medium text-gray-900 mt-1">{selectedTask.content || '无'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">使用模型</span>
                      <p className="font-medium text-gray-900 mt-1">{getModelName(selectedTask.models?.[0])}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">创建时间</span>
                      <p className="font-medium text-gray-900 mt-1">{formatTime(selectedTask.created_at || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">消耗积分</span>
                      <p className="font-medium text-gray-900 mt-1">{selectedTask.points_consumed || 0}</p>
                    </div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">进度</span>
                    <span className="text-gray-700">
                      {selectedTask.status === 'COMPLETED' ? '100%' : 
                       selectedTask.status === 'CREATING' ? '50%' : 
                       selectedTask.status === 'QUEUING' ? '10%' : 
                       selectedTask.status === 'FAILED' ? '0%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getStatusConfig(selectedTask.status).progress}`}
                      style={{
                        width: selectedTask.status === 'COMPLETED' ? '100%' : 
                               selectedTask.status === 'CREATING' ? '50%' : 
                               selectedTask.status === 'QUEUING' ? '20%' : '0%'
                      }}
                    />
                  </div>
                </div>

                {/* 生成结果 */}
                <div className="flex-1">
                  <span className="text-sm text-gray-500 mb-2 block">生成结果</span>
                  {selectedTask.status === 'COMPLETED' && selectedTask.result_info && selectedTask.result_info.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTask.result_info.map((videoPath, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                          <div className="relative">
                            <video
                              src={`${API_BASE_URL}${videoPath}`}
                              alt={`作品 ${index + 1}`}
                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleVideoClick(videoPath)}
                              poster="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20thumbnail%20placeholder&image_size=landscape_16_9"
                            />
                            <button
                              onClick={() => handleVideoDownload(videoPath)}
                              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                              title="下载视频"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedTask.status === 'COMPLETED' ? (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">作品已完成，结果加载中...</p>
                    </div>
                  ) : selectedTask.status === 'CREATING' ? (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-gray-500">AI 正在创作中，请稍候...</p>
                      </div>
                    </div>
                  ) : selectedTask.status === 'QUEUING' ? (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="h-8 w-8 text-amber-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500">任务排队中，请耐心等待...</p>
                      </div>
                    </div>
                  ) : selectedTask.status === 'FAILED' ? (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="h-8 w-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-gray-500">任务失败</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">任务已{selectedTask.status === 'CANCELED' ? '取消' : '失效'}</p>
                    </div>
                  )}
                </div>

                {/* 额外信息 */}
                {selectedTask.extra_info && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm text-yellow-800">{selectedTask.extra_info}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无作品</h3>
                <p className="text-sm text-gray-500">在左侧输入提示词开始创作你的第一个视频</p>
              </div>
            )}
          </div>

          {/* 右侧创作历史和账户余额面板 */}
          <div className="w-80 flex-shrink-0">
            {/* 创作历史 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                创作历史
              </h2>

              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 border border-gray-200 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {tasks.map((task, index) => {
                    const statusConfig = getStatusConfig(task.status);
                    return (
                      <div
                        key={task.work_id || task.creation_id}
                        onClick={() => handleTaskSelect(task)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          (selectedTask?.work_id === task.work_id || selectedTask?.creation_id === task.creation_id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 truncate flex-1">
                            #{index + 1} {task.content || '无内容'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(task.created_at || 0)}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${statusConfig.progress}`}
                            style={{
                              width: task.status === 'COMPLETED' ? '100%' : 
                                     task.status === 'CREATING' ? '50%' : 
                                     task.status === 'QUEUING' ? '20%' : '0%'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-500">暂无创作记录</p>
                </div>
              )}
            </div>

            {/* 账户余额 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">账户余额</h3>
              {balanceLoading ? (
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              ) : (
                <div className="text-center p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                  <p className="text-2xl font-bold">{balance}</p>
                  <p className="text-sm opacity-80">可用积分</p>
                </div>
              )}
              <div className="mt-3 text-xs text-gray-500 text-center">
                每次创作消耗 {selectedModelPoints} 积分
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 视频预览Modal */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="relative">
          <video
            src={previewVideo}
            alt="预览视频"
            className="w-full h-auto max-h-[80vh] object-contain"
            controls
          />
          <button
            onClick={() => handleVideoDownload(previewVideo.replace(API_BASE_URL, ''))}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
            title="下载视频"
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

export default VideoEngine;