import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { login } from '../api';
import { useAuthStore } from '../store/authStore';
import { getPublicKey } from '../api';
import { passwordEncryptor } from '../utils/passwordEncryptor';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

interface LoginFormData {
  account: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const setAuth = useAuthStore((state) => state.setAuth);



  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const res = await getPublicKey();
      if(res.state !== 200) {
        message.error(res.message || '获取公钥失败，请稍后重试');
        return;
      }
      passwordEncryptor.setPublicKey(res.data.publicKey);
      const encryptedPasswordResult = await passwordEncryptor.preparePasswordForLogin(values.password);
      console.log(encryptedPasswordResult);
      const response = await login({
        account: values.account,
        password: encryptedPasswordResult.encryptedPassword,
        encryption: encryptedPasswordResult.encryptionType
      });
      if (response.state === 200) {
        setAuth(response.data.user, response.data.access_token);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        message.success('登录成功！正在跳转...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        message.error(response.message || '登录失败，请稍后重试');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error('账号或密码错误');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('登录失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full shadow-2xl rounded-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-3xl text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">欢迎回来</h2>
          <p className="text-gray-600 mt-2">登录您的账号继续创作</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="account"
            label="账号"
            rules={[
              { required: true, message: '请输入账号' },
            ]}
          >
            <Input 
              placeholder="请输入账号" 
              prefix={<UserIcon />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
            ]}
          >
            <Input.Password 
              placeholder="请输入密码" 
              prefix={<LockIcon />}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Link to="/forgot-password" className="text-purple-600 hover:text-purple-700 text-sm">
                忘记密码？
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-purple-600 hover:bg-purple-700 border-purple-600 h-12"
            >
              登录
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span className="text-gray-600">还没有账号？</span>
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              立即注册
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}