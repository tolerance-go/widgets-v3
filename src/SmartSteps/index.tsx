import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Steps } from 'antd';
import { StepProps } from 'antd/es/steps';
const { Step } = Steps;

type StepItem = StepProps & { key?: React.Key };

interface SmartStepsMethods {
  goNext: () => void;
  goBack: () => void;
}

interface SmartStepsProps {
  steps: StepItem[];
  renderContent: (args: {
    stepIndex: number;
    methods: SmartStepsMethods;
    isFirst: boolean;
    isLast: boolean;
  }) => React.ReactNode;
}

const SmartSteps = forwardRef<SmartStepsMethods, SmartStepsProps>(
  ({ steps, renderContent }, ref) => {
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

    return (
      <div>
        <Steps current={currentStep}>
          {steps.map((item, index) => (
            <Step key={index} {...item} />
          ))}
        </Steps>
        <div>
          {renderContent({
            stepIndex: currentStep,
            methods,
            isFirst: currentStep === 0,
            isLast: currentStep === steps.length - 1,
          })}
        </div>
      </div>
    );
  },
);

export default SmartSteps;
