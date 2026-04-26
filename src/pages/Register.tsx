import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Checkbox, Modal } from 'antd';
import CanvasVerify from '../components/CanvasVerify';
import { register } from '../api';
import { verifyManager } from '../store/verifyStore';
import { getPublicKey } from '../api';
import { passwordEncryptor } from '../utils/passwordEncryptor';

const UserAddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

interface RegisterFormData {
  account: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  email?: string;
  agreement: boolean;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [verifyVisible, setVerifyVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RegisterFormData | null>(null);
  const [lockoutInfo, setLockoutInfo] = useState<{ blocked: boolean; reason?: string }>({ blocked: false });
  const [captchaKey, setCaptchaKey] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);

  const checkLockout = useCallback(() => {
    const lockout = verifyManager.isLocked();
    if (lockout) {
      const remaining = Math.ceil(verifyManager.getRemainingLockoutTime() / 1000);
      setLockoutInfo({
        blocked: true,
        reason: `注册已锁定，请在 ${remaining} 秒后重试`
      });
      return true;
    }
    setLockoutInfo({ blocked: false });
    return false;
  }, []);

  const submitRegistration = useCallback(async (values: RegisterFormData) => {
    if (checkLockout()) {
      return;
    }

    setLoading(true);

    const result = verifyManager.recordAttempt(true, values.account);

    if (result.blocked) {
      message.error(result.reason);
      setLoading(false);
      return;
    }

    try {
      const res = await getPublicKey();
      if(res.state === 200) {
        passwordEncryptor.setPublicKey(res.data.publicKey);
        console.log(res.data.publicKey);
      }else{
        message.error(res.message || '获取公钥失败，请稍后重试');
        return;
      }
       const { password, encryption }  = await passwordEncryptor.preparePasswordForRegistration(values.password);
      console.log(password);

      const response = await register({
        account: values.account,
        password,
        encryption,
        phone: values.phone,
        email: values.email,
      });

      if (response.state === 200) {
        message.success('注册成功！正在跳转登录页面...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        verifyManager.recordAttempt(false, values.account);
        message.error(response.message || '注册失败，请稍后重试');
        setIsVerified(false);
      }
    } catch (error: any) {
      verifyManager.recordAttempt(false, values.account);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('注册失败，请稍后重试');
      }
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  }, [checkLockout, navigate]);

  const onFinish = useCallback((values: RegisterFormData) => {
    if (checkLockout()) {
      return;
    }

    if (!isVerified) {
      setPendingFormData(values);
      setCanvasKey(prev => prev + 1);
      setVerifyVisible(true);
      return;
    }

    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    if (!values.agreement) {
      message.error('请阅读并同意用户协议');
      return;
    }

    submitRegistration(values);
  }, [isVerified, checkLockout, submitRegistration]);

  const handleVerifySuccess = useCallback(() => {
    setIsVerified(true);
    setVerifyVisible(false);
  }, []);

  const handleModalAfterClose = useCallback(() => {
    if (isVerified && pendingFormData) {
      submitRegistration(pendingFormData);
    }
    setPendingFormData(null);
  }, [isVerified, pendingFormData, submitRegistration]);

  const handleVerifyClose = useCallback(() => {
    setVerifyVisible(false);
  }, []);

  const handleRefresh = useCallback(() => {
    setCaptchaKey(prev => prev + 1);
  }, []);

  const handleVerifyVisibleChange = useCallback((visible: boolean) => {
    if (visible) {
      setIsVerified(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full shadow-2xl rounded-lg">
        <div className="text-center mb-8">
          <UserAddIcon />
          <h2 className="text-3xl font-bold text-gray-900">创建新账号</h2>
          <p className="text-gray-600 mt-2">加入我们，开启创意之旅</p>
        </div>

        {lockoutInfo.blocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm">{lockoutInfo.reason}</span>
            </div>
          </div>
        )}

        <Form
          form={form}
          name="register"
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
              { min: 4, message: '账号至少4个字符' },
              { max: 20, message: '账号最多20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '账号只能包含字母、数字和下划线' }
            ]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 20, message: '密码最多20个字符' }
            ]}
          >
            <Input.Password placeholder="请输入密码" prefix={<LockIcon />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号（选填）"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" prefix={<PhoneIcon />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱（选填）"
            rules={[
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" prefix={<MailIcon />} />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议')) }
            ]}
          >
            <Checkbox>
              我已阅读并同意<a href="/#/agreement" className="text-purple-600">《用户服务协议》</a>和<a href="/#/privacy" className="text-purple-600">《隐私政策》</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-purple-600 hover:bg-purple-700 border-purple-600"
              disabled={lockoutInfo.blocked}
            >
              {isVerified ? '注册' : '注册（需先验证）'}
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span className="text-gray-600">已有账号？</span>
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              立即登录
            </Link>
          </div>
        </Form>
      </Card>

      <Modal
        open={verifyVisible}
        onCancel={handleVerifyClose}
        onVisibleChange={handleVerifyVisibleChange}
        footer={null}
        closable={true}
        centered
        width={380}
        afterClose={handleModalAfterClose}
      >
        <div className="pt-2">
          <CanvasVerify
            key={canvasKey}
            onSuccess={handleVerifySuccess}
            width={320}
            height={180}
          />
        </div>
      </Modal>
    </div>
  );
}
