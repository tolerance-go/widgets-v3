import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'antd';

const ImageResizeModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          showModal();
        };
        if (e.target?.result) {
          img.src = e.target.result.toString();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageCentered = () => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, imagePos.x, imagePos.y, image.width, image.height);
    }
  };

  useEffect(() => {
    if (isModalVisible && image) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 计算居中绘制的初始位置
        const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
        const x = canvas.width / 2 - (image.width / 2) * scale;
        const y = canvas.height / 2 - (image.height / 2) * scale;
        setImagePos({ x, y });

        drawImageCentered();
      }
    }
  }, [isModalVisible, image]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - startDragPos.x;
      const dy = e.clientY - startDragPos.y;
      setImagePos((prevPos) => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
      setStartDragPos({ x: e.clientX, y: e.clientY });
      drawImageCentered();
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <Modal
        title="Adjust Image Size"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        forceRender
      >
        <canvas
          ref={canvasRef}
          width="500"
          height="500"
          style={{ border: '1px solid black' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp} // 如果鼠标移出画布，也停止拖动
        />
      </Modal>
    </>
  );
};

export default ImageResizeModal;
