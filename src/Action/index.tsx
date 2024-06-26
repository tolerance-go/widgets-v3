import React, { ReactElement, useState, cloneElement } from 'react';
import { Button, Spin, message } from 'antd';
import { handleError } from 'src/_utils/handleError';

type ActionProps = {
  trigger?: ReactElement | ((args: { loading: boolean }) => ReactElement);
  request?: () => Promise<void>;
};

const Action = ({ trigger, request }: ActionProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleTriggerClick =
    (originalOnClick?: (event: React.MouseEvent<Element, MouseEvent>) => void) =>
    async (event: React.MouseEvent) => {
      // 如果 trigger 元素有自己的 onClick 逻辑，先执行它
      originalOnClick && originalOnClick(event);

      if (!event.defaultPrevented && request) {
        setLoading(true); // 开始加载
        try {
          await request(); // 等待异步请求完成
        } catch (error) {
          handleError(error, '操作异常');
        } finally {
          setLoading(false); // 结束加载
        }
      }
    };

  if (!trigger) {
    return null;
  }

  const triggerEl = typeof trigger === 'function' ? trigger({ loading }) : trigger;

  // 使用 cloneElement 来增加原始 trigger 元素的 onClick 处理器
  const enhancedTrigger = cloneElement(triggerEl, {
    onClick: handleTriggerClick(triggerEl.props.onClick),
    loading,
    // 这里传递任何需要的额外 props
  });

  return <>{enhancedTrigger}</>;
};

export default Action;
