import { DatePicker } from 'antd';
import { RangePickerProps, RangePickerValue } from 'antd/es/date-picker/interface'; // 导入 RangePicker 的类型定义
import moment from 'moment';
import React, { useState } from 'react';
import useUpdateEffect from 'src/_utils/useUpdateEffect';

const { RangePicker } = DatePicker;

type StringRangePickerValue =
  | undefined[]
  | null[]
  | [string]
  | [undefined, string]
  | [string, undefined]
  | [null, string]
  | [string, null]
  | [string, string];

type SmartRangePickerValue = StringRangePickerValue | RangePickerProps['value'];

interface SmartRangePickerProps extends Omit<RangePickerProps, 'value' | 'onChange'> {
  value?: SmartRangePickerValue; // 使用新定义的类型
  valueFormat?: string;
  onChange?: (dates: SmartRangePickerValue) => void;
}

const SmartRangePicker: React.FC<SmartRangePickerProps> = ({
  value,
  valueFormat,
  format = valueFormat,
  onChange,
  ...restProps
}) => {
  const convertToMoment = (date: string | undefined | null): moment.Moment | undefined | null => {
    if (date === undefined || date === null) {
      return date;
    }
    return moment(date, valueFormat);
  };

  const convertToString = (date: moment.Moment | undefined | null): string | undefined | null => {
    if (moment.isMoment(date)) {
      return date.format(valueFormat);
    }
    return date;
  };

  const [dates, setDates] = useState<(moment.Moment | undefined | null)[]>(() => {
    if (valueFormat) {
      const stringVal = value as StringRangePickerValue;
      return Array.isArray(stringVal)
        ? [convertToMoment(stringVal[0]), convertToMoment(stringVal[1])]
        : [];
    }
    return Array.isArray(value) ? (value as (moment.Moment | undefined | null)[]) : [];
  });

  useUpdateEffect(() => {
    if (valueFormat) {
      const stringVal = value as StringRangePickerValue;
      if (Array.isArray(value)) {
        setDates([convertToMoment(stringVal[0]), convertToMoment(stringVal[1])]);
      } else {
        setDates([]);
      }
    } else {
      if (Array.isArray(value)) {
        setDates(value as (moment.Moment | undefined | null)[]);
      } else {
        setDates([]);
      }
    }
  }, [value, valueFormat]);

  const handleRangeChange = (dates: RangePickerValue): void => {
    if (valueFormat) {
      const formattedDates = [convertToString(dates[0]), convertToString(dates[1])];
      setDates(dates);
      onChange?.(formattedDates as SmartRangePickerValue);
    } else {
      setDates(dates);
      onChange?.(dates as SmartRangePickerValue);
    }
  };

  return (
    <RangePicker
      {...restProps}
      value={dates as RangePickerValue}
      onChange={handleRangeChange}
      format={format}
    />
  );
};

export default SmartRangePicker;
