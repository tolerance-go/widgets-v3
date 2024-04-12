import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { RangePickerProps, RangePickerValue } from 'antd/es/date-picker/interface'; // 导入 RangePicker 的类型定义
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

interface StringRangePickerProps extends Omit<RangePickerProps, 'value' | 'onChange'> {
  value?: StringRangePickerValue; // 使用新定义的类型
  valueFormat?: string;
  onChange?: (dates: StringRangePickerValue) => void;
}

const StringRangePicker: React.FC<StringRangePickerProps> = ({
  value,
  valueFormat = 'YYYY-MM-DD',
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

  const [dates, setDates] = useState<(moment.Moment | undefined | null)[]>(
    Array.isArray(value) ? [convertToMoment(value[0]), convertToMoment(value[1])] : [],
  );

  useUpdateEffect(() => {
    if (Array.isArray(value)) {
      setDates([convertToMoment(value[0]), convertToMoment(value[1])]);
    } else {
      setDates([]);
    }
  }, [value, valueFormat]);

  const handleRangeChange = (dates: RangePickerValue): void => {
    const formattedDates = [convertToString(dates[0]), convertToString(dates[1])];
    setDates(dates);
    onChange?.(formattedDates as StringRangePickerValue);
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

export default StringRangePicker;
