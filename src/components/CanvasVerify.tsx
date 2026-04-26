import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CanvasVerifyProps {
  onSuccess: () => void;
  onFail?: () => void;
  width?: number;
  height?: number;
  visible?: boolean;
}

interface Target {
  x: number;
  y: number;
  radius: number;
  char: string;
  color: string;
}

const CanvasVerify: React.FC<CanvasVerifyProps> = ({
  onSuccess,
  onFail,
  width = 320,
  height = 180,
  visible = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [clickedTargets, setClickedTargets] = useState<Set<number>>(new Set());
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const targetChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const targetColors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];

  const generateTargets = useCallback(() => {
    const newTargets: Target[] = [];
    const numTargets = 4;
    const padding = 40;
    const radius = 22;

    for (let i = 0; i < numTargets; i++) {
      let x, y, attempts = 0;
      do {
        x = padding + Math.random() * (width - padding * 2);
        y = padding + Math.random() * (height - padding * 2);
        attempts++;
      } while (
        attempts < 50 &&
        newTargets.some(t => Math.hypot(t.x - x, t.y - y) < radius * 3)
      );

      newTargets.push({
        x,
        y,
        radius,
        char: targetChars[i],
        color: targetColors[i]
      });
    }

    return newTargets;
  }, [width, height]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

    ctx.fillStyle = '#343a40';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('请依次点击', width / 2, 18);

    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 0.5 + 0.3})`;
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 0.6 + 0.2})`;
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const currentTargets = targets.length > 0 ? targets : generateTargets();
    if (targets.length === 0) {
      setTargets(currentTargets);
    }

    currentTargets.forEach((target, index) => {
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);

      if (clickedTargets.has(index)) {
        ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#2ecc71';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('✓', target.x, target.y);
      } else {
        const gradient = ctx.createRadialGradient(
          target.x - 5, target.y - 5, 0,
          target.x, target.y, target.radius
        );
        gradient.addColorStop(0, target.color);
        gradient.addColorStop(1, shadeColor(target.color, -20));
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = shadeColor(target.color, -30);
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(target.char, target.x, target.y);
      }
    });

    if (isVerified) {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('验证成功', width / 2, height / 2);
    }

    if (showError) {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(errorMessage, width / 2, height / 2);

      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 1500);
    }
  }, [targets, clickedTargets, isVerified, showError, errorMessage, width, height, generateTargets]);

  useEffect(() => {
    if (targets.length === 0) {
      const newTargets = generateTargets();
      setTargets(newTargets);
    }
    drawCanvas();
  }, [drawCanvas, targets.length, generateTargets]);

  const shadeColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isVerified) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const targetIndex = targets.findIndex((target, index) => {
      if (clickedTargets.has(index)) return false;
      const distance = Math.hypot(target.x - x, target.y - y);
      return distance <= target.radius + 5;
    });

    if (targetIndex === -1) {
      return;
    }

    const expectedIndex = clickedTargets.size;
    if (targetIndex === expectedIndex) {
      const newClicked = new Set(clickedTargets);
      newClicked.add(targetIndex);
      setClickedTargets(newClicked);

      if (newClicked.size === targets.length) {
        setTimeout(() => {
          setIsVerified(true);
          setTimeout(() => {
            onSuccess();
          }, 600);
        }, 300);
      }
    } else {
      setShowError(true);
      setErrorMessage('点击顺序错误，请重试');
      setClickedTargets(new Set());
      setCaptchaKey(prev => prev + 1);
    }
  }, [targets, clickedTargets, isVerified, onSuccess]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY
    } as React.MouseEvent<HTMLCanvasElement>;
    handleCanvasClick(mouseEvent);
  }, [handleCanvasClick]);

  const handleRefresh = useCallback(() => {
    setTargets([]);
    setClickedTargets(new Set());
    setIsVerified(false);
    setShowError(false);
    setErrorMessage('');
    setCaptchaKey(prev => prev + 1);
    const newTargets = generateTargets();
    setTargets(newTargets);
  }, [generateTargets]);

  useEffect(() => {
    if (captchaKey > 0) {
      const newTargets = generateTargets();
      setTargets(newTargets);
    }
  }, [captchaKey, generateTargets]);

  useEffect(() => {
    if (visible) {
      handleRefresh();
    }
  }, [visible, handleRefresh]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-2xl select-none">
      <div className="text-base font-semibold text-gray-800 mb-4 text-center">
        安全验证
      </div>

      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block cursor-pointer w-full"
          style={{ touchAction: 'none' }}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
        />

        {isVerified && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-full p-4 shadow-xl animate-bounce">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="text-gray-500">已点击：</span>
          <span className="text-green-600 font-semibold ml-1">
            {clickedTargets.size} / {targets.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新验证码
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-400 text-center">
        {isVerified
          ? '验证通过，可继续操作'
          : `请按顺序点击：${targets.map((t, i) => clickedTargets.has(i) ? `✓${t.char}` : t.char).join(' → ')}`
        }
      </div>
    </div>
  );
};

export default CanvasVerify;
