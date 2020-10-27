
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, message, Input, Upload, Switch, Modal, Icon, Select } from 'antd';
import apiConfig from '@/utils/apiConfig';

const TextArea = Input.TextArea;


@Form.create()
@connect(({
  webVersion: {
    filter,
    list,
    statusMap,
    countryMap = [],
  }
}) => ({
  filter,
  list,
  statusMap,
  countryMap,
}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    }
  }

  public componentDidMount() {
    const { url } = this.props.detail;
    // console.log(this.props.detail,'this.props.detail')
    if (url) {
      let md5 = url.replace(/(.*\/)*([^.]+).*/ig, "$2");
      const detailurl = url ? { uid: md5, name: `${md5}.zip`, status: 'done', url } : null;
      this.setState({
        fileList: [detailurl]
      })
    }
  }

  public onOk = () => {
    const { form: { validateFields }, dispatch, detail, onClose, countryMap } = this.props;

    validateFields((err, values) => {
      if (err) {
        return
      }
      const md5 = (values.url[0].url || values.url[0].response.path).replace(/(.*\/)*([^.]+).*/ig, "$2");
      //  console.log(values,'values')
      let ext_json = values.ext_json;
      try {
        ext_json = JSON.stringify(JSON.parse(values.ext_json))
      } catch (error) {
        message.error('不是正确json格式');
        return
      }
      dispatch({
        type: `webVersion/${detail.id ? 'modify' : 'save'}`,
        payload: {
          ...detail,
          ...values,
          md5,
          url: values.url[0].url || values.url[0].response.url,
          // path:values.url[0].url||values.url[0].response.path,
          ext_json,
          status: +(!!values.status)
        }
      }
      )
        .then((res) => {
          if (res.code == 0) {
            onClose();
          }
        })
    })
  }

  public normFile = e => {
    console.log(e);
    if (Array.isArray(e)) {
      return e;
    }
    if (e.file.status == 'error' || e.file.type.indexOf('zip') == -1) {
      return
    }
    return e && ([e.fileList[e.fileList.length - 1]]);
  };

  public render() {
    const { props: { form: { getFieldDecorator },countryMap, onClose, detail, detail: { version, nation, info, ext_json = `{ "vip": "vip.html", "recommend": "recommend.html", "wallet": "wallet.html#wallet", "recharge": "wallet.html#wallet/recharge", "pay": "wallet.html#wallet/pay" }`, status = false }, dispatch }, onOk } = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const uploadParams = {
      multiple: false
    };
    return (
      <Modal
        title={`${!Object.keys(detail).length ? '新增' : '编辑'}${!!/f1s1\.cn/.test(apiConfig) ? '' : '生产环境'}`}
        centered
        visible={true}
        onOk={() => onOk()}
        onCancel={() => onClose()}
        className="i_edit"
      >
        <style>
          {`
             .i_edit .ant-upload.ant-upload-select{
                  display:block
              }
            `}
        </style>
        <Form.Item {...formItemLayout} label="安卓版本">
          {getFieldDecorator('version', {
            rules: [
              {
                required: true,
                message: '请输入对应的安卓版本',
              },
            ],
            initialValue: version
          })(<Input placeholder="请输入对应的安卓版本" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={'投放国家'}>
          {getFieldDecorator('nation',(nation==='0')?{}:{
             initialValue: nation
          })(
            <Select
              placeholder="请选择投放国家"
              style={{ width: '100%' }}
            >
               <Select.Option key={0} value="0">默认</Select.Option>
              {countryMap.map(item => {
                return (
                  <Select.Option key={item.id} value={''+item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="h5 zip包">
          {getFieldDecorator('url', {
            rules: [
              {
                required: true,
                message: '请上传zip文件包',
              },
            ],
            initialValue: this.state.fileList,
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            trigger: 'onChange'
          })(
            <Upload {...uploadParams}
              customRequest={({ file, onSuccess, onError }) => {
                const params = new FormData();
                params.append('multiMedia', file);

                // return;
                dispatch({
                  type: "webVersion/uploadMedia",
                  payload: {
                    multiMedia: file
                  }
                })
                  .then((res) => {
                    if (!res.code) {
                      onSuccess(res.data, file);
                      return
                    }
                    onError({});
                  })

              }}
              beforeUpload={(file, fileList) => {
                if (file.type.indexOf('zip') == -1) {
                  return false
                }
              }}>
              <Button>
                <Icon type="upload" /> 上传zip包
              </Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="h5 zip包描述">
          {getFieldDecorator('info', { initialValue: info })(<Input placeholder="zip包描述" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="输入JSON配置">
          {getFieldDecorator('ext_json', {
            rules: [
              {
                required: true,
                message: '输入JSON配置',
              },
            ],
            initialValue: ext_json
          })(<TextArea placeholder="输入JSON配置" autoSize={{ minRows: 4 }} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否上架">
          {getFieldDecorator('status', {
            initialValue: !!(+status),
            valuePropName: 'checked'
          })(<Switch />)}
        </Form.Item>
      </Modal>
    )
  }
}
export default Edit;
