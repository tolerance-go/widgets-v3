turn [ <ModalForm key={'modal-form-1'} title='修改手机号' trigger={ <Button icon='plus' type='primary'>新建</Button> } renderFormItems={({ form: { getFieldDecorator } }) => { return [ <Form.Item key='项目编号' label="项目编号"> {getFieldDecorator('email', { rules: [{ required: true }] })(<Input placeholder='请输入' autoComplete="off" />)} </Form.Item>, <Form.Item key='姓名' label="姓名" hasFeedback> {getFieldDecorator('password', { rules: [{ required: true }] })(<Input placeholder='请输入' autoComplete="off" />)} </Form.Item>, <Form.Item key='原手机号' label="原手机号" hasFeedback> {getFieldDecorator('confirm', { rules: [{ required: true }] })(<Input placeholder='请输入' autoComplete="off" />)} </Form.Item>, <Form.Item key='修改后手机号' label="修改后手机号" hasFeedback> {getFieldDecorator('confirm', { rules: [{ required: true }] })(<Input placeholder='请输入' autoComplete="off" />)} </Form.Item>, ] }} renderCustomActionGroup={({ toggleModal, form }) => { return <Action trigger={ <Button type='primary'>确认修改</Button> } request={async () => {

                                    const values = await new Promise((resolve, reject) => {
                                        form.validateFieldsAndScroll((errors, values) => {
                                            if (errors) {
                                                reject(new Error('表单验证失败'));
                                                return;
                                            }

                                            resolve(values)
                                        })
                                    })

                                    const rsp = await request(`${baseUrl}/personEmployee/changePhone`, {
                                        method: 'PATCH',
                                        data: {


                                            -----

                                            消息 重复

                                             <Form.Item key='项目编号' label="项目编号">
                                    {getFieldDecorator('email', {
                                        rules: [{
                                            required: true,
                                            message: '请输入项目编号'
                                        }]
                                    })(<Input placeholder='请输入' autoComplete="off" />)}
                                </Form.Item>,
                                <Form.Item key='姓名' label="姓名" hasFeedback>
                                    {getFieldDecorator('password', {
                                        rules: [{
                                            required: true,
                                            message: '请输入姓名'
                                        }]
                                    })(<Input placeholder='请输入' autoComplete="off" />)}
                                </Form.Item>,
                                <Form.Item key='原手机号' label="原手机号" hasFeedback>
                                    {getFieldDecorator('confirm', {
                                        rules: [{
                                            required: true,
                                            message: '请输入原手机号'
                                        }]
                                    })(<Input placeholder='请输入' autoComplete="off" />)}
                                </Form.Item>,
                                <Form.Item key='修改后手机号' label="修改后手机号" hasFeedback>
                                    {getFieldDecorator('confirm', {
                                        rules: [{
                                            required: true,
                                            message: '请输入修改后手机号'

                                            ---

                                            什么时候用 表单 的 hasFeedback

---

<Action trigger={ <Button size='large' block style={{
                                        marginLeft: 0,
                                    }} type="primary"> 确定 </Button> } request={async () => {

                                    const formValues = await new Promise((resolve, reject) => {
                                        validateFieldsAndScroll((errors, values) => {
                                            if (errors) {
                                                reject('表单验证失败，请检查')
                                                return;
                                            }
                                            resolve(values)
                                        })
                                    })

                                    const rsp = await request(`${baseUrl}/account/unLock`, {
                                        defaultAndThrow: true,
                                        method: 'PATCH',
                                        body: formValues
                                    })
                                    if (rsp?.code !== BE_RIGHT_CODE) {
                                        notification.error({
                                            message: '操作失败，请再试一次',
                                            description: rsp.msg
                                        })
                                        return;
                                    }
                                    message.success('账号已解锁')
                                }}
                            >
                            </Action>


                            封装  notification.error({
                                            message: '操作失败，请再试一次',
                                            description: rsp.msg
                                        })

---

后端分页下拉框，如果搜索没有数据的话，展示 空状态

---

重构 图片预览组件，效果对其 antd@5

---

value 为字符串数组的 DateRange

       const { modifyTime, ...rest } = params.search;

        const query = {
          currentPage: params.pagination.current,
          pageSize: params.pagination.pageSize,
          'qp-auditStatus-in': params.tabItem.data.auditStatus,
          'qp-shipperCode-eq': getChannelCode(),
          ...rest,
          'qp-modifyTime-ge': modifyTime?.[0].format('YYYY-MM-DD HH:mm:ss'),
          'qp-modifyTime-le': modifyTime?.[1].format('YYYY-MM-DD HH:mm:ss'),
        };

---

支持 valueType

          title: '操作日期',
          dataIndex: 'createTime',
          key: 'createTime',
          render: val => moment.utc(val).format('YYYY-MM-DD HH:mm:ss'),

---

重置自动搜索一次

---

                              const res = await request(`${baseUrl}/logisticsCompany/getCompanyListNoPage`)
                              if (res.code !== BE_SUCCESS_CODE) {
                                throw res.msg
                              }


                              支持 trow 一个带 type 对象

---

~~删除 editableTable 的行选择功能，新增 SelectableTable~~
