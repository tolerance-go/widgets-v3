import React, { useState, useRef, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { Steps } from 'antd';
import { StepProps } from 'antd/es/steps';
const { Step } = Steps;

export type SmartStepItem = Required<Pick<StepProps, 'title'>> &
  Omit<StepProps, 'title'> & { key?: React.Key };

interface SmartStepsMethods {
  goNext: () => void;
  goBack: () => void;
}

export interface SmartStepsProps<T extends SmartStepItem = SmartStepItem> {
  steps?: T[];
  renderContent: (args: {
    item: T;
    index: number;
    methods: SmartStepsMethods;
    isFirst: boolean;
    isLast: boolean;
  }) => React.ReactNode;
  forceRender?: boolean; // 新增 forceRender 属性
}

const SmartSteps = <T extends SmartStepItem = SmartStepItem>(
  { steps = [], renderContent, forceRender }: SmartStepsProps<T>,
  ref: ForwardedRef<SmartStepsMethods>,
) => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods: SmartStepsMethods = {
    goNext: () => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    },
    goBack: () => {
      setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
    },
  };

  useImperativeHandle(ref, () => methods);

  const renderContentInner = () => {
    if (forceRender) {
      return (
        <>
          {steps.map((item, index) => (
            <div
              key={item.key ?? index}
              style={{
                display: index === currentStep ? 'block' : 'none',
              }}
            >
              {renderContent({
                item,
                index: index,
                methods,
                isFirst: index === 0,
                isLast: index === steps.length - 1,
              })}
            </div>
          ))}
        </>
      );
    }

    return renderContent({
      item: steps[currentStep],
      index: currentStep,
      methods,
      isFirst: currentStep === 0,
      isLast: currentStep === steps.length - 1,
    });
  };

  return (
    <div>
      <Steps current={currentStep}>
        {steps.map((item, index) => (
          <Step key={index} {...item} />
        ))}
      </Steps>
      <div>{renderContentInner()}</div>
    </div>
  );
};

export default forwardRef(SmartSteps) as <T extends SmartStepItem = SmartStepItem>(
  props: SmartStepsProps<T> & { ref?: ForwardedRef<SmartStepsMethods> },
) => JSX.Element;
