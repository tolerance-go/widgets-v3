import React, { useState, HTMLAttributes, useEffect } from 'react';
import './FullscreenImage.less'; // 引入组件的样式
import { classNames } from '../_utils/classNames';

type FullscreenImageProps = HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
};

const FullscreenImage: React.FC<FullscreenImageProps> = (props) => {
  const { src, alt, ...imgProps } = props;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // 处理Esc键的功能
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    // 当组件挂载时，添加键盘事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 组件卸载时，清除事件监听器
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]); // 依赖项数组中包含isFullscreen，确保状态更新时能够重新绑定事件处理函数

  return (
    <>
      <img
        {...imgProps}
        src={src}
        alt={alt}
        onClick={() => setIsFullscreen(true)}
        className={classNames(imgProps.className, isFullscreen ? 'wg-hidden' : 'wg-interactive')} // 合并传入的className
      />
      {isFullscreen && (
        <div className="wg-fullscreen-container" onClick={toggleFullscreen}>
          <div className="wg-mask"></div>
          <img src={src} alt={alt} className="wg-fullscreen-image" />
          <span className="wg-close-button">✕</span>
        </div>
      )}
    </>
  );
};

export default FullscreenImage;
