import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, Modal, message, notification  } from 'antd';
import { fetchplus, urlplus } from './fetchplus.js'

const createForm = Form.create;
const FormItem = Form.Item;

class ProcessModal extends React.Component {
    state = {
        visible: false,
        tableData: [],
        // total: 0,
        // process: {
        //     dictionaryName: '',
        //     dictionaryChName: '',
        //     diactionartDescript: '',
        // }
    }
    handleOk = (e) => {
        this.props.form.validateFields((errors, values) => {
            let colName = values.colName == undefined ? '' : values.colName
            if (colName !== ''){
                this.props.addCol(colName)
                notification.info({
                    message: '添加列提示',
                    description: '添加列成功',
                })
                this.setState({
                    visible: false,
                });
            }else{
                    notification.warning({
                    message: '添加列填写不完整',
                    description: '添加列失败',
                })
            }
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
        this.setState({ visible: true})
        // let data = this.props.data
        // if(data !== undefined){
        //     this.setState({
        //         process: data
        //     })
        // }
    }
    // handleSubmit = () => {
        
    // }

    render() {
        const { getFieldDecorator } = this.props.form;
        // let process = this.state.process
        // let button = this.props.text;
        let title = this.props.title;
        // let change = this.props.change
        return (
        <div>
            <Button type="primary" onClick={this.showModal}  style={{ width: '90%' }} disabled={this.props.disabled} >添加列</Button>
            <Modal
            title={title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={ 500 }
            // footer={ [
            //     // <Button></Button>,
            //     <Button key="back" onClick={this.handleCancel}>关闭</Button>
            //     <Button key=></Button>
            // ] }
            >
                <Form>
                    <Row>
                        <Col sm={24}>
                            <FormItem label="字典名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                { 
                                    getFieldDecorator('colName', {
                                        // initialValue: process.colName==''?"":process.colName,
                                        rules: [
                                            { required: true, message: '请输入添加列名' },
                                        ],
                                    })(
                                        <Input placeholder="请输入新的列名" size="default" />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={6}>
                            <FormItem wrapperCol={{ span: 12, offset: 8 }}>
                                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>{ button }</Button>
                            </FormItem>
                        </Col>
                    </Row> */}
                </Form>
            </Modal>
        </div>
        );
    }
}

ProcessModal = Form.create({})(ProcessModal);
export default ProcessModal;