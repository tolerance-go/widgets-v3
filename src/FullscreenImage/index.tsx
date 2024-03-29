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
  const [isLoading, setIsLoading] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => setIsLoading(false);

  // 处理Esc键的功能
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  // 新增：处理点击遮罩或关闭按钮的事件
  const handleCloseClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    setIsFullscreen(false);
  };

  // 新增：处理点击全屏图片的事件，阻止事件冒泡
  const handleImageClick = (event: React.MouseEvent) => {
    event.stopPropagation();
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
        onClick={() => {
          setIsFullscreen(true);
          setIsLoading(true);
        }}
        className={classNames(imgProps.className, 'wg-interactive')}
      />
      {isFullscreen && (
        <div className="wg-fullscreen-container" onClick={handleCloseClick}>
          <div className="wg-content-wrapper">
            {!isLoading && (
              <span className="wg-close-button" onClick={handleCloseClick}>
                ✕
              </span>
            )}
            <img
              src={src}
              alt={alt}
              className="wg-fullscreen-image"
              onClick={handleImageClick}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="wg-mask"></div>
        </div>
      )}
    </>
  );
};

export default FullscreenImage;
