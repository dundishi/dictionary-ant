import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button, DatePicker, Table, Modal, Popconfirm, Cascader } from 'antd';
import { urlplus, fetchplus } from './fetchplus.js'
// import styles from '../../Styles/Common/Common.css'
import ProcessModal from './ProcessModal.js'

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

class ProcessConfig extends React.Component {
    state = {
        interfaceList: [],
        tableData: [],
        value: '',
    }
    componentWillMount = () => {
        //获取账户接口请求所需要的参数
        let data = { name: '' }
        let urlinterface = urlplus + 'allDic'
        let resultinterface = (result) => {
            let res = JSON.parse(result).data
            // console.log(res);
            this.setState({ interfaceList: res })
        }
        let errorinterface = (e) => {
            console.log("Error");
        }
        //发送获取账户接口请求
        fetchplus(urlinterface, data, resultinterface, errorinterface)
    }
    onChange = (pagination, filters, sorter) => {
        //console.log('各类参数是', pagination, filters, sorter);
    }
    // handleReset = (e) => {
    //     e.preventDefault();
    //     this.props.form.resetFields();
    // }
    handleChange(value) {
        //console.log(`selected ${value}`);
    }
    getId = (id) => {
        sessionStorage.setItem("changeProcessId", id)
    }
    //查询
    resultfnQuery = (ress, data) => {
        if (ress) {
            let res = JSON.parse(ress).data;
            console.log(res)
            for (let i = 0; i < res.length; i++) {
                // res[i].interface_id = parseInt(res[i].interface_id)
                res[i]['key'] = res[i].id
            }
            this.setState({
                tableData: res
            })
        }
    }
    errorfnQuery = (err) => {
        console.log("Error");
    }
    // 查询字典详情
    handleQuery = () => {
        this.props.form.validateFields((errors, values) => {
            // console.log(values)
            let dictionaryName = values.dictionaryName === undefined ? '' : values.dictionaryName
            let url = urlplus + 'searchDic'
            let data = {
                "dictionaryName": dictionaryName
            }
            fetchplus(url, data, this.resultfnQuery, this.errorfnQuery)
        });
    }
    //删除
    resultfnDelete = (ress, data) => {
        if (ress) {
            let res = JSON.parse(ress)
            if (res.code == "200") {
                this.handleQuery()
            }
        }
    }
    errorfnDelete = (err) => {
        console.log("Error");
        sessionStorage.setItem("changeProcessId", "");
    }
    confirm = (id) => {
        let url = urlplus + 'deleteDic'
        let data = { 'id': id }
        fetchplus(url, data, this.resultfnDelete, this.errorfnDelete)
    }
    render() {
        const { getFieldProps, getFieldDecorator } = this.props.form;

        const options = this.state.interfaceList.map(d => <Option key={d.value}>{d.text}</Option>);
        const columns = [
            {
                title: '字典编号',
                dataIndex: 'id',
                key: 'id',
                width: 200,
                sorter: (a, b) => a.id - b.id,
            }, {
                title: '字典名称',
                dataIndex: 'dicChName',
                key: 'dicChName',
                width: 200,
            }, {
                title: '字典描述',
                dataIndex: 'dicDescription',
                key: 'dicDescription',
                width: 250
            }, {
                title: '删除接口',
                key: 'Delete',
                width: 100,
                // fixed: 'right',
                render: (text, record) =>
                    <Popconfirm title="删除接口" onConfirm={() => this.confirm(record.id)} onCancel={this.cancel}>
                        <Button type="primary" style={{ padding: '2 4', background: '' }}>删除接口</Button>
                    </Popconfirm>,
            }, {
                title: '配置/详情',
                key: 'ProcessCheck',
                // fixed: 'right',
                width: 100,
                render: (text, record) => <ProcessModal change={false} text="更改配置" title="配置/详情" data={record} handleQuery={() => this.handleQuery()} />,
            },
        ];
        const pagination = {
            total: this.state.tableData.length,
            // showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                //console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange(current) {
                //console.log('Current: ', current);
            },
        };
        return (
            <div style={{ background: '#fff', padding: '40px' }}>
                <Row>
                    <Col sm={8}>
                        <h2 style={{ display: 'inline', marginRight: '45px', }}>字典配置管理</h2>
                    </Col>
                    <Col sm={4}>
                        <ProcessModal change={false} text="添加字典" title="添加字典" handleQuery={() => this.handleQuery()} />
                    </Col>
                </Row>
                <Row style={{ paddingTop: '40px' }}>
                    <Form>
                        <Row gutter={16}>
                            <Col sm={12}>
                                <FormItem
                                    label="字典名称"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {
                                        getFieldDecorator('dictionaryName', {
                                            // initialValue: user.username
                                        })(
                                            <Select
                                                placeholder={"请选择接口名称"}
                                                onChange={this.selectChange}
                                                showArrow={false}
                                                filterOption={false}
                                                style={{ width: '90%' }}
                                            >
                                                {options}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={3} offset={4}>
                                <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col span={3} offset={4}>
                                <Button type="primary" htmlType="submit" onClick={this.handleQuery}>查询</Button>
                            </Col>
                            <Col span={3} offset={1}>
                                <Button onClick={this.handleReset}>重置</Button>
                            </Col>
                        </Row> */}
                    </Form>
                </Row>
                <Row>
                    <Col span={22} offset={1}>
                        <Table columns={columns} dataSource={this.state.tableData} onChange={this.onChange} pagination={pagination} style={{ marginTop: '20px' }} scroll={{ x: 1050 }} />
                    </Col>
                </Row>
            </div>
        );
    }
}
ProcessConfig = createForm()(ProcessConfig);
export default ProcessConfig;