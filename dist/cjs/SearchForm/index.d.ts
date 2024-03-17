import React from 'react';
import * as PropTypes from 'prop-types';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
type Item = {
    node: PropTypes.ReactNodeLike;
    span?: number;
};
interface AdvancedSearchFormProps extends FormComponentProps {
    defaultFieldCount?: number;
    itemSpan?: number;
    renderFormItems?: ({ form }: {
        form: WrappedFormUtils;
    }) => (PropTypes.ReactNodeLike | Item)[];
}
declare const WrappedAdvancedSearchForm: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<AdvancedSearchFormProps>, import("antd/lib/_util/type").Omit<AdvancedSearchFormProps, "form">>;
export default WrappedAdvancedSearchForm;
