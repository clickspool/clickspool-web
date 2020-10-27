import { getPlatform } from '@/utils/utils';
import { modify } from '@/services/versions';
import { type } from '@/utils/utils';

import { connect } from 'dva';

import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Breadcrumb,
  Icon,
  Button,
  Select,
} from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import { operationEnum, getKey } from '../../../config/role.enum';

import AddModal from './AddModal.js';
import styles from './Versions.less';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const Search = Input.Search;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    if (this.props.inputType === 'area') {
      return <TextArea />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: 'Please Input' + title + '!',
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
@connect(({ versions, routing: { location: { pathname } }, memberInfo: { data: { keys } } }) => ({
  versions,
  keys,
  pathname,
}))
class Versions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      editingKey: '',
      pagination: { page: 1, total_page: 0 },
      breadcrumb: formatMessage({ id: 'menu.system.versions' }),
      tableLocal: {
        filterTitle: formatMessage({ id: 'app.table.filterTitle' }),
        filterConfirm: formatMessage({ id: 'app.table.filterConfirm' }),
        filterReset: formatMessage({ id: 'app.table.filterReset' }),
        emptyText: formatMessage({ id: 'app.table.emptyText' }),
      },
    };
    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
        width: '80',
        editable: false,
      },
      {
        title: formatMessage({ id: 'app.versions.table.version' }),
        dataIndex: 'version',
        width: '80',
        editable: true,
      },
      {
        title: formatMessage({ id: 'app.versions.table.info' }),
        dataIndex: 'info',
        width: '200',
        editable: true,
        tag:'area'
      },
      {
        title: formatMessage({ id: 'app.versions.table.url' }),
        dataIndex: 'url',
        width: '150',
        editable: true,
      },
      {
        title: formatMessage({ id: 'app.versions.table.menberid' }),
        dataIndex: 'member_id',
        width: '80',
        editable: false,
      },
      {
        title: formatMessage({ id: 'app.versions.table.creatTime' }),
        dataIndex: 'create_time',
        width: '150',
        editable: false,
      },
      {
        title: formatMessage({ id: 'app.versions.table.platform' }),
        dataIndex: 'platform',
        width: '80',
        editable: false,
        render: text => {
          return <span>{getPlatform(text)}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.versions.table.operation' }),
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="#"
                        onClick={() => this.save(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        {formatMessage({ id: 'app.versions.save' })}
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                    <a>{formatMessage({ id: 'app.versions.cancel' })}</a>
                  </Popconfirm>
                </span>
              ) : (
                <div>
                    <a onClick={() => this.edit(record.id)}>
                      {formatMessage({ id: 'app.versions.edit' })}
                    </a>
                </div>
              )}
            </div>
          );
        },
      },
    ];
    this.addVersions = this.addVersions.bind(this);
    this.save = this.save.bind(this);
    this.updataConfiList = this.updataConfiList.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount() {
    this.updataConfiList();
  }
  isEditing = record => {
    return record.id === this.state.editingKey;
  };
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // handleSubmit(){
  //   // const {form} = this.props;

  // }
  save(form, key) {
    const { data } = this.props.versions;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...data];
      const index = newData.findIndex(item => key == item.id);
      if (index > -1) {
        modify(_.merge({}, data[index], row)).then(res => {
          if (!res.code) {
            this.updataConfiList();
          }
        });
        this.setState({ editingKey: '' });
      } else {
        // newData.push(row);
        this.setState({ editingKey: '' });
      }
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  addVersions() {
    this.setState(
      {
        modalVisible: true,
      },
      () => {}
    );
  }
  onSearch(value) {
    this.setState(
      {
        pagination: { page: 1, app_version: value.trim() },
      },
      () => {
        this.updataConfiList();
      }
    );
  }
  closeVersionsModel = item => {
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        if (item) {
          this.updataConfiList();
        }
      }
    );
  };
  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'versions/getConfigList',
      payload: pagination,
    });
  }

  render() {
    const { versions, keys, pathname } = this.props;
    const { breadcrumb, modalVisible, tableLocal } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      let inputType = 'text'
      if(col.tag){
        inputType = 'area'
      }
      return {
        ...col,
        onCell: record => {
            return {
            record,
            inputType: inputType,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
          }
      },
      };
    });

    return (
      <div>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.system' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
              <Search
                placeholder={formatMessage({ id: 'app.versions.inputVersion' })}
                enterButton={formatMessage({ id: 'app.pages.search' })}
                size="default"
                onSearch={this.onSearch}
              />
            )}
          </div>
          <div className={styles.btnBox}>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && (
              <Button type="primary" onClick={this.addVersions}>
                {formatMessage({ id: 'app.versions.add' })}
              </Button>
            )}
          </div>
          <div />
          <div />
        </div>
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <Table
            components={components}
            bordered
            dataSource={versions.data}
            pagination={false}
            columns={columns}
            rowClassName="editable-row"
            locale={tableLocal}
            rowKey={(record, index) => `${record.id}${index}`}
          />
        )}
        <AddModal modalVisible={modalVisible} onCloseModel={this.closeVersionsModel} />
      </div>
    );
  }
}
export default Versions;
