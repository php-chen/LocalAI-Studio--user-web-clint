/**
 * 主布局组件
 * 包含Header和Footer，包裹页面内容
 */
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * 主布局函数组件
 * @param children - 子组件内容
 * @returns 包含Header和Footer的布局结构
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="app">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;