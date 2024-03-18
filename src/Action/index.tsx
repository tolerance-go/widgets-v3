import React, { ReactElement, useState, cloneElement } from 'react';
import { Button, Spin, message } from 'antd';

type ActionProps = {
  trigger?: ReactElement;
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
          let errorMessage;

          // 判断错误的类型
          if (typeof error === 'string') {
            // 如果错误是一个字符串
            errorMessage = error;
          } else if (error instanceof Error) {
            // 如果错误是Error对象
            errorMessage = error.message;
          }

          console.log(error);
          message.error(errorMessage || '操作异常');
        } finally {
          setLoading(false); // 结束加载
        }
      }
    };

  if (!trigger) {
    return null;
  }

  // 使用 cloneElement 来增加原始 trigger 元素的 onClick 处理器
  const enhancedTrigger = cloneElement(trigger, {
    onClick: handleTriggerClick(trigger.props.onClick),
    loading,
    // 这里传递任何需要的额外 props
  });

  return <>{enhancedTrigger}</>;
};

export default Action;
