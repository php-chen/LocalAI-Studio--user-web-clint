/**
 * 路由配置
 * 定义应用的所有路由信息
 */
import Home from '../pages/Home';
import ImageLab from '../pages/ImageLab';
import VideoEngine from '../pages/VideoEngine';
import Works from '../pages/Works';
import Materials from '../pages/Materials';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Agreement from '../pages/Agreement';
import Privacy from '../pages/Privacy';

/**
 * 路由项数据类型
 */
export interface RouteItem {
  path: string;
  element: React.ReactNode;
  meta?: {
    title?: string;
  };
}

/**
 * 路由配置列表
 */
export const routes: RouteItem[] = [
  {
    path: '/',
    element: <Home />,
    meta: { title: '门户首页' }
  },
  {
    path: '/login',
    element: <Login />,
    meta: { title: '用户登录' }
  },
  {
    path: '/register',
    element: <Register />,
    meta: { title: '用户注册' }
  },
  {
    path: '/image-lab',
    element: <ImageLab />,
    meta: { title: '图像实验室' }
  },
  {
    path: '/video-engine',
    element: <VideoEngine />,
    meta: { title: '视频引擎' }
  },
  {
    path: '/works',
    element: <Works />,
    meta: { title: '作品中心' }
  },
  {
    path: '/materials',
    element: <Materials />,
    meta: { title: '素材库' }
  },
  {
    path: '/agreement',
    element: <Agreement />,
    meta: { title: '用户服务协议' }
  },
  {
    path: '/privacy',
    element: <Privacy />,
    meta: { title: '隐私政策' }
  }
];