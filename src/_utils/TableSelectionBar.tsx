import { Alert, Row, Col, Button } from 'antd';
import React from 'react';

export const TableSelectionBar = ({
  selectedRowKeys,
  clearSelection,
  selectionDetail,
  batchActionGroup,
}: {
  selectedRowKeys: string[] | number[];
  clearSelection: () => void;
  selectionDetail: React.ReactNode;
  batchActionGroup: React.ReactNode;
}) => {
  return selectedRowKeys.length ? (
    <Alert
      style={{ marginBottom: 16 }}
      message={
        <Row type="flex" gutter={10} align="middle" justify="space-between">
          <Col>
            <Row type="flex" align="middle" gutter={8}>
              <Col>
                <span>
                  <span>已选 {selectedRowKeys.length} 项</span>
                  <Button
                    style={{
                      marginLeft: 8,
                    }}
                    size="small"
                    type="link"
                    onClick={clearSelection}
                  >
                    取消选择
                  </Button>
                </span>
              </Col>
              <Col>{selectionDetail}</Col>
            </Row>
          </Col>
          <Col>
            <Row align="middle" type="flex" gutter={8}>
              {React.Children.map(batchActionGroup, (action: React.ReactNode, index: number) => (
                <Col key={index}>{action}</Col>
              ))}
            </Row>
          </Col>
        </Row>
      }
    ></Alert>
  ) : null;
};
