import { Button, Row } from 'antd';
import React, { useEffect, useRef } from 'react';
import { SmartSteps } from 'widgets-v3';

const Child = ({ title }: { title: React.ReactNode }) => {
  useEffect(() => {
    console.log(title);
  }, []);

  return <>{title}</>;
};

const App: React.FC = () => {
  return (
    <SmartSteps
      forceRender
      steps={[{ title: '第一步', subTitle: '子标题' }, { title: '第二步' }, { title: '第三步' }]}
      renderContent={({ item, index, methods: { goNext, goBack }, isFirst, isLast }) => (
        <div>
          <p>当前是第 {index + 1} 步</p>
          <Child title={item.title} />
          <div
            style={{
              display: 'flex',
              gap: 8,
            }}
          >
            {!isFirst && (
              <Button type="primary" onClick={() => goBack()}>
                上一步
              </Button>
            )}
            {!isLast && (
              <Button type="primary" onClick={() => goNext()}>
                下一步
              </Button>
            )}
            {isLast && <Button type="primary">提交</Button>}
          </div>
        </div>
      )}
    />
  );
};

export default App;
