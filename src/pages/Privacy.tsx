import React from 'react';
import MainLayout from '../layouts/MainLayout';

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">隐私政策</h1>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. 隐私政策的适用范围</h2>
              <p className="text-gray-600">
                本隐私政策适用于CXF-AI提供的所有服务，包括但不限于图像生成、视频生成、素材管理等功能。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">2. 信息收集</h2>
              <p className="text-gray-600">
                我们收集用户提供的信息，包括但不限于账号、密码、手机号、邮箱等个人信息，以及用户在使用服务过程中产生的操作数据、生成内容等。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">3. 信息使用</h2>
              <p className="text-gray-600">
                我们使用收集的信息用于以下目的：提供和改进服务、用户身份验证、安全防范、个性化推荐、服务通知等。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">4. 信息存储与保护</h2>
              <p className="text-gray-600">
                我们采取多种安全措施保护用户信息，包括加密存储、访问控制、定期安全审计等。用户信息将存储在安全的服务器上，仅授权人员可以访问。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">5. 信息共享</h2>
              <p className="text-gray-600">
                我们不会向第三方共享用户信息，除非获得用户明确授权或法律要求。我们可能与合作伙伴共享匿名化的统计数据，但不会包含用户个人信息。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">6. 用户权利</h2>
              <p className="text-gray-600">
                用户有权访问、修改、删除自己的个人信息，有权限制我们对个人信息的处理，有权撤回对信息收集和使用的授权。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">7. 数据保留</h2>
              <p className="text-gray-600">
                我们将根据法律法规的要求和业务需要保留用户信息。当用户账号被删除或服务终止时，我们将删除或匿名化用户信息。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">8. 隐私政策的修改</h2>
              <p className="text-gray-600">
                我们有权根据法律法规的变更和业务发展需要修改本隐私政策。修改后的隐私政策将在网站上公布，用户继续使用服务视为接受修改后的隐私政策。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">9. 联系我们</h2>
              <p className="text-gray-600">
                如果用户对本隐私政策有任何疑问或建议，可以通过客服渠道联系我们，我们将及时回应并处理。
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}