import { Button, Row } from 'antd';
import React, { useRef } from 'react';
import { SmartSteps } from 'widgets-v3';

const App: React.FC = () => {
  return (
    <SmartSteps
      steps={[{ title: '第一步', subTitle: '子标题' }, { title: '第二步' }, { title: '第三步' }]}
      renderContent={({ stepIndex, methods: { goNext, goBack }, isFirst, isLast }) => (
        <div>
          <p>当前是第 {stepIndex + 1} 步</p>
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
