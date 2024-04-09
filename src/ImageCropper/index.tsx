import React, { useState, useRef, useEffect } from 'react';
import { Icon, Modal, Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import useUpdateEffect from 'src/_utils/useUpdateEffect';

interface ImageResizeModalProps {
  value?: string; // 外部传入的图片URL
  onChange?: (newValue: string) => void; // 外部处理图片改变的函数
}

const ImageResizeModal: React.FC<ImageResizeModalProps> = ({ value, onChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1); // 缩放状态，用于缩放
  const fileInputRef = useRef<HTMLInputElement>(null); // 添加引用
  const dragSensitivity = 0.2; // 可以调整这个值来改变拖拽的灵敏度
  const [croppedImageURL, setCroppedImageURL] = useState<string | undefined>(() => value);

  const canvasWidth = 500;
  const canvasHeight = 500;

  // 定义镂空矩形的大小和位置
  const holeWidth = 150; // 可根据需求调整镂空矩形的宽度
  const holeHeight = 150; // 可根据需求调整镂空矩形的高度
  const holeX = (canvasWidth - holeWidth) / 2; // 镂空矩形的X位置
  const holeY = (canvasHeight - holeWidth) / 2; // 镂空矩形的Y位置

  const scaleStep = 0.01;

  const [sliderMin, setSliderMin] = useState(1);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useUpdateEffect(() => {
    setCroppedImageURL(value);
  }, [value]);

  const handleCropImage = () => {
    if (image && canvasRef.current) {
      // 创建一个新的canvas用于截图
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = holeWidth;
      cropCanvas.height = holeHeight;
      const ctx = cropCanvas.getContext('2d');

      if (!ctx) return;

      // 计算截图区域相对于原始图片的位置和大小
      const sx = (holeX - imagePos.x) / scale;
      const sy = (holeY - imagePos.y) / scale;
      const sWidth = holeWidth / scale;
      const sHeight = holeHeight / scale;

      // 在新canvas上绘制截图区域的图像
      ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, holeWidth, holeHeight);

      // 将截图后的图像转换为DataURL，并保存到状态中
      const croppedImage = cropCanvas.toDataURL('image/png');
      setCroppedImageURL(croppedImage);
      onChange?.(croppedImage);
      setIsModalVisible(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          showModal();

          // 计算并更新 Slider 的 Min 和 Max
          const maxHoleSide = Math.max(holeWidth, holeHeight);
          const minImageSide = Math.min(img.width, img.height);
          const minScale = maxHoleSide / minImageSide; // 最小缩放比例，以确保覆盖镂空区域
          setSliderMin(minScale);
        };
        if (e.target?.result) {
          img.src = e.target.result.toString();
        }
      };
      reader.readAsDataURL(file);
    }

    // 重置文件输入，以便下次可以选择同一个文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const drawImageCentered = () => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制图片
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      ctx.drawImage(image, imagePos.x, imagePos.y, scaledWidth, scaledHeight);

      // 创建镂空区域路径
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height); // 绘制外部遮罩区域
      ctx.rect(holeX, holeY, holeWidth, holeHeight); // 定义内部镂空区域
      ctx.closePath();

      ctx.save();

      // 使用 clip 创建镂空效果
      ctx.clip('evenodd'); // 'evenodd' 规则用于创建镂空效果

      // 绘制遮罩层
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
    }
  };

  useEffect(() => {
    drawImageCentered();
  }, [scale, imagePos]); // 当缩放或图像位置改变时重绘

  useEffect(() => {
    if (isModalVisible && image) {
      // 保证图片至少填充整个镂空区域，而不是整个画布
      const maxHoleSide = Math.max(holeWidth, holeHeight); // 镂空区域的最大边
      const minImageSide = Math.min(image.width, image.height); // 图片的最小边
      const scaleToFitHole = maxHoleSide / minImageSide; // 根据镂空区域与图片最小边的比例计算缩放比例

      // 计算中心点对齐的位置
      const holeCenterX = holeX + holeWidth / 2;
      const holeCenterY = holeY + holeHeight / 2;
      const imageCenterX = (image.width * scaleToFitHole) / 2;
      const imageCenterY = (image.height * scaleToFitHole) / 2;
      const imagePosX = holeCenterX - imageCenterX;
      const imagePosY = holeCenterY - imageCenterY;

      // 设置图片位置和缩放比例
      setImagePos({ x: imagePosX, y: imagePosY });
      setScale(scaleToFitHole);

      // 立即绘制以反映新位置和缩放
      drawImageCentered();
    }
  }, [image, isModalVisible]); // 依赖项保持不变

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing'; // 拖动时显示为小手握住
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!image) return;

    if (dragging) {
      const dx = (e.clientX - startDragPos.x) * dragSensitivity;
      const dy = (e.clientY - startDragPos.y) * dragSensitivity;

      setImagePos((prevPos) => {
        let newX = prevPos.x + dx;
        let newY = prevPos.y + dy;

        // 添加约束以确保图片始终覆盖镂空矩形区域
        const maxX = holeX + holeWidth - image.width * scale;
        const maxY = holeY + holeHeight - image.height * scale;
        const minX = holeX;
        const minY = holeY;

        newX = Math.min(Math.max(newX, maxX), minX);
        newY = Math.min(Math.max(newY, maxY), minY);

        return {
          x: newX,
          y: newY,
        };
      });

      setStartDragPos({ x: e.clientX, y: e.clientY });
      drawImageCentered();
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab'; // 松开时恢复为默认的张开的小手
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (!image) return;

    const direction = e.deltaY < 0 ? 1 : -1; // 根据滚轮方向确定是放大还是缩小

    // 获取鼠标在canvas上的位置
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 考虑当前图片位置和缩放比例，计算鼠标相对于图片的位置
    const mouseImgX = (mouseX - imagePos.x) / scale;
    const mouseImgY = (mouseY - imagePos.y) / scale;

    setScale((prevScale) => {
      let newScale = Math.max(scaleStep, prevScale + direction * scaleStep);

      // 新增限制：确保图像的最小边长不低于镂空矩形的最大边长
      const maxSideLength = Math.max(holeWidth, holeHeight); // 镂空矩形的最大边长
      const minImageSide = Math.min(image.width * newScale, image.height * newScale); // 图像缩放后的最小边长
      if (minImageSide < maxSideLength) {
        // 如果图像的最小边长低于镂空矩形的最大边长，则不进行缩放
        return prevScale; // 返回原先的缩放比例
      }

      // 基于新的缩放比例，重新计算图片的位置，以使鼠标下的点保持静止
      const newPosX = mouseX - mouseImgX * newScale;
      const newPosY = mouseY - mouseImgY * newScale;

      // 添加约束以确保图片始终覆盖镂空矩形区域
      const maxX = holeX + holeWidth - image.width * newScale;
      const maxY = holeY + holeHeight - image.height * newScale;
      const minX = holeX;
      const minY = holeY;

      let constrainedPosX = Math.min(Math.max(newPosX, maxX), minX);
      let constrainedPosY = Math.min(Math.max(newPosY, maxY), minY);

      setImagePos({ x: constrainedPosX, y: constrainedPosY });

      return newScale;
    });
  };

  const triggerFileInput = () => {
    // 触发隐藏的 file input 的点击事件
    fileInputRef.current?.click();
  };

  const handleScaleChange = (newScale: SliderValue) => {
    if (!image) return;

    let scaleValue = Array.isArray(newScale) ? newScale[0] : newScale; // 处理 newScale 可能是数组的情况

    // 确保图像的最小边长不低于镂空矩形的最大边长
    const maxHoleSide = Math.max(holeWidth, holeHeight); // 镂空区域的最大边长
    const minImageSide = Math.min(image.width, image.height); // 图片的最小边
    const minScale = maxHoleSide / minImageSide; // 最小缩放比例，以确保覆盖镂空区域
    scaleValue = Math.max(scaleValue, minScale); // 应用最小缩放限制

    // 假定在画布中心点模拟滚轮滚动效果
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // 模拟鼠标相对于图片的位置
    const mouseImgX = (centerX - imagePos.x) / scale;
    const mouseImgY = (centerY - imagePos.y) / scale;

    // 根据新的缩放级别计算图片的位置
    const newPosX = centerX - mouseImgX * scaleValue;
    const newPosY = centerY - mouseImgY * scaleValue;

    // 更新图像位置和缩放级别
    setImagePos({ x: newPosX, y: newPosY });
    setScale(scaleValue);

    // 重新绘制图像
    drawImageCentered();
  };
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <div
        onClick={triggerFileInput}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          position: 'relative',
          width: holeWidth,
          height: holeHeight,
        }}
        onMouseOver={() => setShowOverlay(true)}
        onMouseOut={() => setShowOverlay(false)}
      >
        {croppedImageURL ? (
          <img
            src={croppedImageURL}
            alt="Click to upload"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #eee',
              borderRadius: 4,
            }}
          >
            <Icon type="plus" style={{ fontSize: 32, color: '#1890ff' }} />
          </div>
        )}

        {croppedImageURL && showOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none', // 添加这一行，不触发 onMouseOut
            }}
          >
            <Icon type="camera" style={{ fontSize: 32, marginBottom: 20 }} />
            <span
              style={{
                fontSize: 14,
              }}
            >
              修改图片
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }} // 隐藏 input 元素
      />
      <Modal
        title="调整图片"
        visible={isModalVisible}
        onCancel={handleCancel}
        forceRender
        width={canvasWidth}
        bodyStyle={{
          padding: 0,
        }}
        okText="确认"
        cancelText="取消"
        onOk={handleCropImage} // 添加确认按钮的回调函数
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp} // 如果鼠标移出画布，停止拖拽
          onWheel={handleWheel} // 处理滚轮事件以进行缩放
          style={{ cursor: 'grab' }} // 默认显示为张开的小手
        />
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span>缩小</span>
          <Slider
            style={{
              flex: 1,
            }}
            min={sliderMin}
            max={sliderMin * 2}
            step={scaleStep}
            value={scale}
            onChange={handleScaleChange}
            tooltipVisible={false}
          />
          <span>放大</span>
        </div>
      </Modal>
    </>
  );
};

export default ImageResizeModal;
