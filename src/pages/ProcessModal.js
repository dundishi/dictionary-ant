import React, { Component } from 'react';
import { Form, Input, InputNumber, Select, Row, Col, Button, DatePicker, Table, Modal, Popconfirm, message, notification  } from 'antd';
import { fetchplus, urlplus } from './fetchplus.js'
// import styles from '../../Styles/Common/Common.css'

const createForm = Form.create;
const FormItem = Form.Item;

class ProcessModal extends React.Component {
    state = {
        visible: false,
        tableData: [],
        total: 0,
        process: {
            dictionaryName: '',
            dictionaryChName: '',
            diactionartDescript: '',
        }
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
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
        let data = this.props.data
        if(data !== undefined){
            this.setState({
                process: data
            })
        }
    }
    //添加更新接口
    resultfnSubmit = (ress,data) => {
        if(ress){
            let res = JSON.parse(ress)
            if(res.code == "200"){
                this.setState({ visible: false })
                this.props.handleQuery()
                notification.info({
                    message: '字典配置提示',
                    description: '字典配置成功',
                })
            }else{
                notification.info({
                    message: '字典配置提示',
                    description: '字典名已存在',
                })
            }
        }
    }
    errorfnSubmit = (err) => {
        console.log("Error");
    }
    handleSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            let dictionaryName = values.dictionaryName == undefined ? '' : values.dictionaryName
            let diactionartDescript = values.diactionartDescript == undefined ? '' : values.diactionartDescript
            let dictionaryChName = values.dictionaryChName == undefined ? '' : values.dictionaryChName
            if (dictionaryName !== '' && diactionartDescript !== '' && dictionaryChName !== ''){
                let data = {
                    dictionaryName: dictionaryName,
                    diactionartDescript: diactionartDescript,
                    dictionaryChName:dictionaryChName
                }
                let url = this.props.pid?(urlplus+'updateDic'):(urlplus+'addDic')
                fetchplus(url,data,this.resultfnSubmit,this.errorfnSubmit)
            }else{
                    notification.warning({
                    message: '字典配置填写不完整',
                    description: '字典配置失败',
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let process = this.state.process
        let button = this.props.text;
        let title = this.props.title;
        let change = this.props.change
        return (
        <div>
            <Button type="primary" onClick={this.showModal}  style={{ width: '90%' }} disabled={this.props.disabled} >{ button }</Button>
            <Modal
            title={title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={ 500 }
            footer={ [
                // <Button></Button>,
                <Button key="back" onClick={this.handleCancel}>关闭</Button>
            ] }
            >
                <Form>
                    <Row>
                        <Col sm={24}>
                            <FormItem label="字典名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                { 
                                    getFieldDecorator('dictionaryName', {
                                        initialValue: process.dicName==''?"":process.dicName,
                                        rules: [
                                            { required: true, message: '请输入字典名称' },
                                        ],
                                    })(
                                        <Input placeholder="请输入字典名称" size="default" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="中文名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                { 
                                    getFieldDecorator('dictionaryChName', {
                                        initialValue: process.dicChName==''?"":process.dicChName,
                                        rules: [
                                            { required: true, message: '请输入字典中文名称' },
                                        ],
                                    })(
                                        <Input placeholder="请输入字典中文名称" size="default" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="字典描述" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                { 
                                    getFieldDecorator('diactionartDescript', {
                                        initialValue: process.dicDescription==''?"":process.dicDescription,
                                        rules: [
                                            { required: true, message: '请输入字典描述' },
                                        ],
                                    })(
                                        <Input placeholder="请输入字典描述" size="default" />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem wrapperCol={{ span: 12, offset: 8 }}>
                                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>{ button }</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
        );
    }
}

ProcessModal = Form.create({})(ProcessModal);
export default ProcessModal;