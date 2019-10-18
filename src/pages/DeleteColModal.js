import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, Modal, Icon, message, notification, Typography } from 'antd';

const FormItem = Form.Item;
const { Paragraph } = Typography;

class UpdateColModal extends React.Component {
    state = {
        visible: false,
        data: [],
        formItems: [],
        disabled: true,
        index: ''
    }
    handleOk = (e) => {
        this.props.form.validateFields((errors, values) => {
            let index = this.state.index;
            this.props.deleteCol(values,index)
            this.setState({
                visible: false,
            });
            notification.info({
                message: '删除列提示',
                description: '删除列成功',
            })
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    //加载时是否显示接口内容
    showModal = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
        let data = this.props.value;
        this.setState({ visible: true, data: data })
    }

    handleRemove = (key) => {
        const dataSource = this.state.data;
        if (dataSource.length === 1) {
            return;
        }
        this.setState({ data: dataSource.filter(item => item !== key), index: key });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let title = this.props.title;
        let data = this.state.data;
        const formItems = data.map((k, index) => (
            <FormItem
                label='列名'
                labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}
                required={false}
                key={index}
            >
                {getFieldDecorator(`${k}`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: k == '' ? "" : k,
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Please input passenger's name or delete this field.",
                        },
                    ],
                })(<Input style={{ width: '60%', marginRight: 8 }} disabled={this.state.disabled} />)}
                {data.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.handleRemove(k, index)}
                    />
                ) : null}
            </FormItem>
        ));
        return (
            <div>
                <Button type="primary" onClick={this.showModal} style={{ width: '90%' }} disabled={this.props.disabled} >{title}</Button>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={500}
                >
                    <Form>
                        <Row>
                            <Col sm={24}>
                                {formItems}
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

UpdateColModal = Form.create({})(UpdateColModal);
export default UpdateColModal;