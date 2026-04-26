import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api';
import { message } from 'antd';

const POINTS_CONSUMED_PER_CREATION = 5;
const API_BASE_URL = 'http://127.0.0.1:5000';

interface AIModel {
  id: number;
  model_name: string;
  model_type: string;
  config_info: any;
  is_deleted: number;
  created_at: number;
  updated_at: number;
}

interface CreationTask {
  creation_id: string;
  content: string;
  status: 'QUEUING' | 'CREATING' | 'COMPLETED' | 'CANCELED' | 'INVALID';
  result_info?: string[];
  extra_info?: string;
  created_at?: number;
  models?: string[];
  points_consumed?: number;
}

const ImageLab: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<CreationTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<CreationTask | null>(null);
  const [currentCreationId, setCurrentCreationId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.post('/ai-model/list', {
        model_type: 'TEXT_TO_IMAGE',
        page: 1,
        page_size: 20
      });
      if (response.data.state === 200) {
        const modelList = response.data.data.list || [];
        setModels(modelList);
        if (modelList.length > 0 && !selectedModelId) {
          setSelectedModelId(modelList[0].id);
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

  const fetchTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.uuid) {
        message.error('用户未登录');
        return;
      }
      const response = await api.post('/creation/list', {
        user_uuid: user.uuid,
        page: 1,
        page_size: 20
      });
      if (response.data.state === 200) {
        const taskList: CreationTask[] = response.data.data.list || [];
        setTasks(taskList);
        if (taskList.length > 0 && !selectedTask) {
          setSelectedTask(taskList[0]);
          fetchWorkDetail(taskList[0].creation_id);
        }
      }
    } catch (error) {
      message.error('获取任务列表失败');
    } finally {
      setTasksLoading(false);
    }
  }, [selectedTask]);

  const fetchWorkDetail = useCallback(async (creationId: string) => {
    try {
      const response = await api.post('/work/detail', {
        work_id: creationId
      });
      if (response.data.state === 200) {
        const workDetail = response.data.data;
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task =>
            task.creation_id === creationId
              ? { ...task, ...workDetail }
              : task
          );
          return updatedTasks;
        });
        setSelectedTask(prev => {
          if (prev?.creation_id === creationId) {
            return { ...prev, ...workDetail };
          }
          return prev;
        });
        if (workDetail.status === 'COMPLETED') {
          setCurrentCreationId(null);
        }
      }
    } catch (error) {
      console.error('获取作品详情失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchModels();
    fetchBalance();
    fetchTasks();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentCreationId) {
      fetchWorkDetail(currentCreationId);
      interval = setInterval(() => {
        fetchWorkDetail(currentCreationId);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentCreationId, fetchWorkDetail]);

  const handleCreateWork = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uuid) {
      message.error('请先登录');
      return;
    }
    if (!prompt.trim()) {
      message.warning('请输入提示词');
      return;
    }
    if (!selectedModelId) {
      message.warning('请选择一个模型');
      return;
    }
    if (balance < POINTS_CONSUMED_PER_CREATION) {
      message.error('积分不足，无法创建作品');
      return;
    }

    try {
      setIsCreating(true);
      const response = await api.post('/creation/create', {
        user_uuid: user.uuid,
        points_consumed: POINTS_CONSUMED_PER_CREATION,
        models: [selectedModelId.toString()],
        content: prompt,
        creation_type: 'IMAGE',
        status: 'QUEUING'
      });

      if (response.data.state === 200) {
        message.success('作品创建成功');
        const newCreationId = response.data.data.creation_id;
        setCurrentCreationId(newCreationId);
        setPrompt('');

        await fetchBalance();
        await fetchTasks();

        setTimeout(() => {
          const newTask = tasksRef.current.find(t => t.creation_id === newCreationId);
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

  const handleTaskSelect = async (task: CreationTask) => {
    setSelectedTask(task);
    await fetchWorkDetail(task.creation_id);
    if (task.status !== 'COMPLETED' && task.status !== 'CANCELED' && task.status !== 'INVALID') {
      if (!currentCreationId || currentCreationId !== task.creation_id) {
        setCurrentCreationId(task.creation_id);
      }
    }
  };

  const getStatusConfig = (status: string) => {
    const configMap: Record<string, { label: string; color: string; progress: string }> = {
      QUEUING: { label: '排队中', color: 'text-amber-600', progress: 'bg-amber-500' },
      CREATING: { label: '创作中', color: 'text-blue-600', progress: 'bg-blue-500' },
      COMPLETED: { label: '已完成', color: 'text-green-600', progress: 'bg-green-500' },
      CANCELED: { label: '已取消', color: 'text-red-600', progress: 'bg-red-500' },
      INVALID: { label: '无效', color: 'text-red-600', progress: 'bg-red-500' }
    };
    return configMap[status] || { label: '未知', color: 'text-gray-600', progress: 'bg-gray-400' };
  };

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

  const getModelName = (modelId: string | undefined) => {
    if (!modelId) return '未选择';
    const model = models.find(m => m.id.toString() === modelId || m.id === parseInt(modelId));
    return model?.model_name || '未知模型';
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创作参数</h2>

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
                      onClick={() => setSelectedModelId(model.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedModelId === model.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                          selectedModelId === model.id ? 'bg-purple-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {model.model_name}
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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提示词 (Prompt)
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="描述你想要生成的图像..."
                rows={5}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={isCreating}
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {prompt.length} 字符
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">消耗积分</span>
                <span className="font-medium text-purple-600">{POINTS_CONSUMED_PER_CREATION} 积分</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">剩余积分</span>
                <span className="font-medium text-blue-600">{balance} 积分</span>
              </div>
            </div>

            <button
              onClick={handleCreateWork}
              disabled={isCreating || balance < POINTS_CONSUMED_PER_CREATION}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isCreating || balance < POINTS_CONSUMED_PER_CREATION
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
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

            {balance < POINTS_CONSUMED_PER_CREATION && (
              <p className="mt-2 text-xs text-red-500 text-center">积分不足，请先充值</p>
            )}
          </div>

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

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">进度</span>
                    <span className="text-gray-700">
                      {selectedTask.status === 'COMPLETED' ? '100%' : 
                       selectedTask.status === 'CREATING' ? '50%' : 
                       selectedTask.status === 'QUEUING' ? '10%' : '0%'}
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

                <div className="flex-1">
                  <span className="text-sm text-gray-500 mb-2 block">生成结果</span>
                  {selectedTask.status === 'COMPLETED' && selectedTask.result_info && selectedTask.result_info.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTask.result_info.map((imgPath, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={`${API_BASE_URL}${imgPath}`}
                            alt={`作品 ${index + 1}`}
                            className="w-full h-48 object-cover"
                            onError={e => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" class="w-full h-48" fill="%23e5e7eb"%3E%3Crect width="100%25" height="100%25"/%3E%3C/svg%3E';
                            }}
                          />
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
                        <svg className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
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
                  ) : (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">任务已{selectedTask.status === 'CANCELED' ? '取消' : '失效'}</p>
                    </div>
                  )}
                </div>

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无作品</h3>
                <p className="text-sm text-gray-500">在左侧输入提示词开始创作你的第一幅作品</p>
              </div>
            )}
          </div>

          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        key={task.creation_id}
                        onClick={() => handleTaskSelect(task)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTask?.creation_id === task.creation_id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
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
                每次创作消耗 {POINTS_CONSUMED_PER_CREATION} 积分
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default ImageLab;