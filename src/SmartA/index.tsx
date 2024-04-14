import { Icon } from 'antd';
import React, { CSSProperties } from 'react';

type SmartAProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  loading?: boolean;
  disabled?: boolean; // 添加 disabled 属性
};

const SmartA: React.FC<SmartAProps> = ({ loading, disabled, children, ...props }) => {
  // 点击事件处理器，当loading或disabled为true时阻止默认行为
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (loading || disabled) {
      event.preventDefault(); // 阻止链接默认操作
      event.stopPropagation(); // 停止事件冒泡
      return;
    }

    // 调用原有的onClick处理器，如果存在
    props.onClick?.(event);
  };

  // 根据 disabled 和 loading 状态设置样式
  const linkStyle: CSSProperties = {
    color: disabled ? '#aaa' : undefined, // 当 disabled 时，颜色设置为灰色
    cursor: disabled || loading ? 'default' : 'pointer', // 设置适当的鼠标样式
  };

  return (
    <a {...props} aria-disabled={disabled} onClick={handleClick} style={linkStyle}>
      {loading ? <Icon type="loading" /> : children}
    </a>
  );
};

export default SmartA;
