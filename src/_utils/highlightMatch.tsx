import React from 'react';

// 创建一个函数来生成带有高亮效果的文本元素
export const highlightMatch = (text: string, search?: string) => {
  if (!search) return <>{text}</>; // 注意此处返回的是 JSX
  const parts: string[] = text?.split(new RegExp(`(${search})`, 'gi')) ?? [];
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: 'yellow', color: 'black' }}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
};
