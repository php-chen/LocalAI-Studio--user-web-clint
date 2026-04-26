import React from 'react';
import MainLayout from '../layouts/MainLayout';

export default function Agreement() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">用户服务协议</h1>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. 协议的接受</h2>
              <p className="text-gray-600">
                欢迎使用CXF-AI服务。本协议是您与CXF-AI之间关于使用我们服务的法律协议。通过注册、登录、使用我们的服务，您同意接受本协议的全部条款和条件。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">2. 服务内容</h2>
              <p className="text-gray-600">
                CXF-AI提供文本转图片、文本转视频等AI创作服务，包括但不限于图像生成、视频生成、素材管理等功能。我们有权根据业务发展需要调整服务内容。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">3. 用户账号</h2>
              <p className="text-gray-600">
                用户需注册账号才能使用我们的服务。用户应提供真实、准确的个人信息，并妥善保管账号密码。如因用户原因导致账号泄露，用户应承担相应责任。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">4. 用户行为规范</h2>
              <p className="text-gray-600">
                用户在使用服务过程中，应遵守法律法规，不得利用服务从事违法违规活动，不得侵犯他人合法权益。如用户违反本规定，我们有权暂停或终止服务。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">5. 知识产权</h2>
              <p className="text-gray-600">
                我们提供的服务和相关内容的知识产权归CXF-AI所有。用户通过服务生成的内容，其知识产权归用户所有，但用户应确保不侵犯第三方权益。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">6. 隐私保护</h2>
              <p className="text-gray-600">
                我们重视用户隐私保护，将按照隐私政策的规定处理用户信息。用户应仔细阅读隐私政策，了解我们如何收集、使用和保护用户信息。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">7. 服务变更与终止</h2>
              <p className="text-gray-600">
                我们有权根据业务发展需要变更或终止服务。如服务终止，我们将提前通知用户，并妥善处理用户数据。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">8. 免责声明</h2>
              <p className="text-gray-600">
                我们尽力提供稳定可靠的服务，但不保证服务的绝对可用性和准确性。对于因服务中断、故障等原因造成的损失，我们不承担赔偿责任。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">9. 协议的修改</h2>
              <p className="text-gray-600">
                我们有权根据法律法规的变更和业务发展需要修改本协议。修改后的协议将在网站上公布，用户继续使用服务视为接受修改后的协议。
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">10. 法律适用与争议解决</h2>
              <p className="text-gray-600">
                本协议的订立、执行、解释及争议的解决均适用中华人民共和国法律。如发生争议，双方应协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}