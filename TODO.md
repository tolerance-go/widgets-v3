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
