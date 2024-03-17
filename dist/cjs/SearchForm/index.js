var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/SearchForm/index.tsx
var SearchForm_exports = {};
__export(SearchForm_exports, {
  default: () => SearchForm_default
});
module.exports = __toCommonJS(SearchForm_exports);
var import_react = __toESM(require("react"));
var import_antd = require("antd");
var AdvancedSearchFormInner = ({
  form,
  defaultFieldCount = 2,
  renderFormItems,
  itemSpan = 8
}) => {
  const [expand, setExpand] = (0, import_react.useState)(false);
  const renderItems = () => {
    if (!renderFormItems) {
      return [];
    }
    let items2 = renderFormItems({ form });
    const count = expand ? items2.length : defaultFieldCount;
    return items2.map((item, index) => {
      let node, span;
      if (import_react.default.isValidElement(item)) {
        node = item;
        span = itemSpan;
      } else if (typeof item === "object" && item !== null && item.node) {
        const rightItem = item;
        node = rightItem.node;
        span = rightItem.span || itemSpan;
      } else {
        return null;
      }
      return /* @__PURE__ */ import_react.default.createElement(import_antd.Col, { span: itemSpan, key: index, style: { display: index < count ? "block" : "none" } }, node);
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  const handleReset = () => {
    form.resetFields();
  };
  const toggleExpand = () => {
    setExpand(!expand);
  };
  const items = renderItems();
  const totalSpanUsed = items.filter((item) => (item == null ? void 0 : item.props.style.display) !== "none").reduce((acc, curr) => acc + (curr ? curr.props.span : 0), 0);
  const lastRowSpanUsed = totalSpanUsed % 24;
  const spanLeft = lastRowSpanUsed === 0 ? 0 : 24 - lastRowSpanUsed;
  const buttonSpan = spanLeft >= 8 ? spanLeft : 24;
  return /* @__PURE__ */ import_react.default.createElement(
    import_antd.Form,
    {
      onSubmit: handleSearch,
      layout: "horizontal",
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    },
    /* @__PURE__ */ import_react.default.createElement(import_antd.Row, { gutter: 24 }, items, /* @__PURE__ */ import_react.default.createElement(import_antd.Col, { span: buttonSpan, style: { textAlign: "right" } }, /* @__PURE__ */ import_react.default.createElement(import_antd.Button, { type: "primary", htmlType: "submit" }, "查询"), /* @__PURE__ */ import_react.default.createElement(import_antd.Button, { style: { marginLeft: 8 }, onClick: handleReset }, "重置"), /* @__PURE__ */ import_react.default.createElement("a", { style: { marginLeft: 8, fontSize: 12 }, onClick: toggleExpand }, expand ? /* @__PURE__ */ import_react.default.createElement("span", null, "收起 ", /* @__PURE__ */ import_react.default.createElement(import_antd.Icon, { type: "up" })) : /* @__PURE__ */ import_react.default.createElement("span", null, "展开 ", /* @__PURE__ */ import_react.default.createElement(import_antd.Icon, { type: "down" })))))
  );
};
var WrappedAdvancedSearchForm = import_antd.Form.create({ name: "advanced_search" })(
  AdvancedSearchFormInner
);
var SearchForm_default = WrappedAdvancedSearchForm;
