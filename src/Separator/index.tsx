import { Divider } from 'antd';
import React from 'react';

interface SeparatorProps {
  children?: React.ReactNode; // 可选的 React 节点
  separator?: React.ReactNode; // 可选的分隔符，默认为 <span>|</span>
  breakAfter?: number; // 可选的，每多少个元素后换行
}

const Separator: React.FC<SeparatorProps> = ({
  children,
  separator = <Divider type="vertical" />,
  breakAfter = Infinity, // 默认值为无穷大，即不换行
}) => {
  // 将 children 转换为数组处理
  const childrenArray = React.Children.toArray(children);

  return (
    <span
      style={{
        // 在你的 Separator 组件中，lineHeight: 2 意味着行高被设置为当前字体大小的两倍。这通常用于增加文本之间的垂直间距，使得视觉上更加舒适和清晰。
        lineHeight: 2,
      }}
    >
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (index + 1) % breakAfter !== 0 && separator}
          {breakAfter !== Infinity &&
            (index + 1) % breakAfter === 0 &&
            index < childrenArray.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
};

export default Separator;
