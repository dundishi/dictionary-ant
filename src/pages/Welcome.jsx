import React from 'react';
import { Card, Table, Input, Icon, InputNumber, Popconfirm, Form, Row, Col, Button, Select, DatePicker, notification, Modal } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { urlplus, fetchplus } from './fetchplus';
import AddColModal from './AddColModal.js';
import UpdateColModal from './UpdateColModal.js';
import DeleteColModal from './DeleteColModal.js';

const EditableContext = React.createContext();
const Option = Select.Option

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],  //字典内容
      editingKey: '', //可编辑的行
      span: false,
      timeVisiable: false, //显示时间选择器
      dictionaryList: [],  //所有字典
      selectDictionary: '', //选择某一字典
      selectTime: '',  //选择时间
      columns: [],  //列
      row: {},  // 行（用于添加行）
      count: 0,
      pagenation: false,
      time: '',   //上次激活时间
      state: '',   //激活状态
      disabled: true,   //禁用状态
      value: [],  //列名

      oprate: {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
              <span>
                <a disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => this.edit(record.key)}>
                  修改
                </a>
                <Popconfirm title="确定删除?" onConfirm={() => this.delete(record.key)}>
                  <a disabled={editingKey !== ''}>删除</a>
                </Popconfirm>
              </span>
            );
        },
      }
    };
  }

  isEditing = record => record.key === this.state.editingKey;

  componentWillMount = () => {
    this.fetch()
  }

  // 请求所有字典
  fetch = () => {
    let data = { name: "" };
    let url = urlplus + 'allDic';
    let result = (res) => {
      let result = JSON.parse(res).data
      for (let i = 0; i < result.length; i++) { result[i]["key"] = i }
      this.setState({ dictionaryList: result })
    }
    let error = (e) => {
      console.log("Error");
    }
    fetchplus(url, data, result, error);
  }

  // 获取需要查询字典
  handleChange = (value) => {
    this.setState({ selectDictionary: value });
  }

  // 发送请求，请求字典内容
  selectDictionary = () => {
    let newData = this.state.selectDictionary;
    if (newData != '') {
      let data = { selectDictionary: newData };
      let url = urlplus + 'selectDic';
      let result = (res) => {
        let time = JSON.parse(res).lastActivationTime
        let result = JSON.parse(res).data
        let state = JSON.parse(res).ActivationState
        let row = {},value = [],count = 0,datas = [];
        for (let i = 0; i < result.length; i++) {
          if (i == 0) {
            for (var key in result[i]) {
              value.push(key);
            }
          }
          result[i]['key'] = i
          row = result[i];
          count = i + 1;
        }
        datas = result;
        this.setState({
          data: datas,
          time: time,
          value: value,
          state: state,
          row: row,
          count: count,
          disabled: false
        })
      }
      let error = (e) => {
        console.log("Error");
      }
      fetchplus(url, data, result, error);
    } else {
      notification['error']({
        message: '请选择需要查询的字典'
      });
    }

  }

  // 编辑行
  edit = (key) => {
    this.setState({ editingKey: key });
  }

  // 删除行
  delete = key => {
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };

  // 保存修改行
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  // 取消修改行
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  // 添加行
  addRow = () => {
    const { count, data, row } = this.state;
    let rows = Object.assign({}, row);
    rows["key"] = count
    data.push(rows)
    this.setState({
      data: data,
      count: count + 1,
    });
  };

  //修改列
  updateCol = (val) => {
    let data = this.state.data
    var arr = []
    let value = []
    for (let i in val) {
      value.push(val[i]); //值
    }
    var arr = []; //定义数组
    let a = ''
    let b = ''
    for (var i in val) {
      arr.push(val[i]);
      if (i != val[i]) {
        b = val[i]
        a = i
        // data = JSON.parse(JSON.stringify(data).replace(new RegExp(a,'g'),b))
        data.map((item, index) => {
          item[b] = item[a]
          delete item[a]
        })
      }
    }
    // let data2 = this.convertKey(data, value);
    // for (let i = 0;i<data2.length;i++){
    //   data2[i]['key'] = i
    // }
    this.setState({
      value: value,
      data: data
    })
  }

  // 添加列
  addCol(m) {
    let value = this.state.value
    let data = this.state.data
    let key = "key"
    value.push(m)
    for (let i = 0; i < data.length; i++) {
      delete data[i].key;
      data[i][m] = 'newData'
      data[i]['key'] = i
    }
    this.setState({
      value: value
    });
  }

  //删除列
  deleteCol = (val, index) => {
    let data = this.state.data
    var arr = []; //定义数组
    for (var i in val) {
      arr.push(val[i]);
    }
    for (let i = 0; i < data.length; i++) {
      delete data[i][index]
    }
    this.setState({
      value: arr
    })
  }

  // 保存数据并发送给后台
  handleSave = () => {
    let selectDictionary = this.state.selectDictionary;
    let newData = this.state.data;
    console.log(newData)
    let resData = {
      selectDictionary: selectDictionary,
      data: newData
    }
    let url = urlplus + 'saveDic';
    let result = (res) => {
      let result = JSON.parse(res)
      if (result.code == '200') {
        notification['success']({
          message: '保存成功'
        });
      } else {
        notification['error']({
          message: '保存失败'
        });
      }
    }
    let error = (e) => {
      console.log("Error");
    }
    fetchplus(url, resData, result, error);
  }

  // 选择是立即激活还是选择时间
  changeSelect = (value) => {
    if (value == 'nowActive') {
      this.setState({ timeVisiable: false, span: true, selectTime: '' })
    } else {
      this.setState({ timeVisiable: true, span: true })
    }
  }

  // 选择时间
  onChange = (value, dateString) => {

  }

  // 确认时间
  onOk = (value) => {
    this.setState({ selectTime: value });
  }

  // 保存激活字典和激活时间
  onActive = () => {
    let selectTime = this.state.selectTime;
    let selectDictionary = this.state.selectDictionary;
    let url = urlplus + 'activeDic';
    let result = (res) => {
      let result = JSON.parse(res)
      if (result.code == '200') {
        notification['success']({
          message: '激活成功'
        });
      }
    }
    let error = (e) => {
      console.log("Error");
    }
    if (selectTime == '') {
      let time = new Date();
      const resDate = time.getFullYear() + '-' + this.p((time.getMonth() + 1)) + '-' + this.p(time.getDate())
      const resTime = this.p(time.getHours()) + ':' + this.p(time.getMinutes()) + ':' + this.p(time.getSeconds())
      selectTime = resDate + " " + resTime;
      let resData = {
        selectTime: selectTime,
        selectDictionary: selectDictionary
      };
      fetchplus(url, resData, result, error);
    } else {
      let resData = {
        selectTime: selectTime,
        selectDictionary: selectDictionary
      };
      fetchplus(url, resData, result, error);
    }
  }

  p(s) {
    return s < 10 ? '0' + s : s
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    let { dictionaryList, columns, oprate, value } = this.state;
    columns = [
      oprate,
      ...value.map((item, key) => ({
        title: item,
        dataIndex: item,
        editable: true
      }))
    ]
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Row style={{ background: '#fff', padding: '40px' }}>
        <Col span={17}>
          <Row style={{ marginBottom: '20px' }}>
            <Col sm={8}>
              <h2 style={{ display: 'inline', marginRight: '45px', }}>字典查询管理</h2>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col lg={12} md={12} sm={12}>
              <Select defaultValue="请选择查询字典" onChange={this.handleChange} style={{ width: '90%' }}>
                {
                  dictionaryList.map((item, index) => (
                    <Option key={index} value={item.value}>{item.text}</Option>
                  ))
                }
              </Select>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <Button type="primary" onClick={this.selectDictionary} style={{ width: '90%' }}> 查询 </Button>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col lg={6} md={6} sm={8}>
              <AddColModal title="添加列" addCol={this.addCol.bind(this)} disabled={this.state.disabled}></AddColModal>
            </Col>
            <Col lg={6} md={6} sm={8}>
              <UpdateColModal title="修改列名" value={this.state.value} updateCol={this.updateCol.bind(this)} disabled={this.state.disabled}></UpdateColModal>
            </Col>
            <Col lg={6} md={6} sm={8}>
              <DeleteColModal title="删除列" value={this.state.value} deleteCol={this.deleteCol.bind(this)} disabled={this.state.disabled}></DeleteColModal>
            </Col>
            <Col lg={6} md={6} sm={8}>
              <Button type="primary" onClick={this.handleSave} style={{ width: '90%' }} disabled={this.state.disabled}> 保存 </Button>
            </Col>
          </Row>
          {this.state.data.length > 1 ?
            <EditableContext.Provider value={this.props.form}>
              <Table
                components={components}
                dataSource={this.state.data}
                columns={columns}
                rowClassName="editable-row"
                pagination={this.state.pagenation}
              />
              <Button type="dashed" onClick={this.addRow} style={{ width: '100%', marginTop: '20px' }}>
                <Icon type="plus" /> 添加行
              </Button>
            </EditableContext.Provider>
            : ''}
        </Col>
        <Col span={6} style={{ marginLeft: '20px' }}>
          <Card>
            <p>上次激活时间：{this.state.time}</p>
            <p>当前状态：{this.state.state == '' ? "" : (this.state.state == '0' ? "未激活" : "已激活")}</p>
            {
              this.state.time == '' ? "" : (
                <Select defaultValue="请选择" onChange={this.changeSelect} style={{ width: "90%" }}>
                  <Option value="nowActive">立即激活</Option>
                  <Option value="selectTime">选择时间</Option>
                </Select>
              )
            }
            {
              this.state.timeVisiable ? (<DatePicker showTime placeholder="Select Time" onChange={this.onChange} onOk={this.onOk} style={{ marginTop: 20 }} />) : ''
            }
            <div>
              {
                this.state.span ? (<Button style={{ marginTop: 20 }} onClick={this.onActive}>确定</Button>) : ''
              }
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;