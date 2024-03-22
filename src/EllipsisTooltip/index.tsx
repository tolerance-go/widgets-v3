import React, { useState, useRef, useEffect, FC } from 'react';
import { Popover } from 'antd';

export type EllipsisTooltipProps = {
  text: string;
  maxWidth: string | number;
};

const EllipsisTooltip: FC<EllipsisTooltipProps> = ({ text, maxWidth }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const compareWidth = () => {
      const element = textRef.current;
      if (element) {
        // 当元素的实际内容宽度大于其视觉宽度时，显示Tooltip
        if (element.scrollWidth > element.offsetWidth) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    };

    compareWidth();
    // 可以添加事件监听器来处理窗口大小变化
    window.addEventListener('resize', compareWidth);
    return () => window.removeEventListener('resize', compareWidth);
  }, [text]); // 依赖于text，因为文本的变化可能会影响宽度判断

  const inner = (
    <span
      ref={textRef}
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
      }}
    >
      {text}
    </span>
  );

  return (
    <span style={{ maxWidth, display: 'inline-block' }}>
      {visible ? (
        <Popover overlayStyle={{ maxWidth: 400 }} content={visible ? text : null}>
          {inner}
        </Popover>
      ) : (
        inner
      )}
    </span>
  );
};

export default EllipsisTooltip;
