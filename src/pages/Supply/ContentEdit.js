import { modify } from '@/services/content';

import {
  Drawer,
  List,
  Avatar,
  Divider,
  Col,
  Row,
  Badge,
  Tag,
  Select,
  Button,
  Input,
  message,
} from 'antd';

import { formatMessage } from 'umi/locale';

const Option = Select.Option;
const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

class ContentEdit extends React.Component {
  state = {
    all_episode: [],
    editSourceList: this.props.editSource,
    showTagSelect: false,
    showSorce: false,
    filters: {
      tag_id: eval(`(${this.props.editSource.tag_ids})`) || '',
      score: this.props.editSource.score,
    },
  };

  showDrawer = () => {};

  onClose = () => {
    this.props.onCloseDrawer();
  };
  handleChange = value => {
    this.setState({ filters: Object.assign({}, this.state.filter, { tag_id: value }) });
  };

  onSubmit = () => {
    const { editSource } = this.props;
    const { filters } = this.state;
    filters.tag_id = filters.tag_id.join(',');
    modify(Object.assign({}, editSource, filters)).then(res => {
      if (!res.code) {
        this.props.onCloseDrawer();
      }
    });
  };

  inputOnchangeHandle = event => {
    if (!event.target.value.trim()) {
      message.warning('得分不为空');
      return;
    }
    if (!/^\d+(\.\d+)?$/.test(event.target.value)) {
      message.warning('必须是数字类型');
      return;
    }
    this.setState({ filters: Object.assign({}, this.state.filter, { score: event.target.value }) });
  };

  componentDidMount() {
    const arr = [];
    for (let i = 0; i < this.props.editSource.all_episode_num - 1; i++) {
      arr.push(i + 1);
    }
    this.setState({
      all_episode: arr,
    });
  }

  render() {
    const { visible, editSource, adminTagList } = this.props;
    const { all_episode, editSourceList } = this.state;

    const JUJI = (
      <div>
        {all_episode.map((item, index) => {
          if (index > editSource.current_update_num - 1) {
            return (
              <Badge
                count={item.toString()}
                key={item}
                overflowCount={100000000}
                style={{
                  marginLeft: '5px',
                  backgroundColor: '#fff',
                  color: '#999',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                }}
              />
            );
          }
          return (
            <Badge
              count={item.toString()}
              key={item}
              overflowCount={100000000}
              style={{ marginLeft: '5px', backgroundColor: '#52c41a', color: '#fff' }}
            />
          );
        })}
      </div>
    );
    const children = [];
    for (let i = 0; i < adminTagList.length; i++) {
      children.push(
        <Option key={i.toString(36) + i} value={adminTagList[i].id}>
          {adminTagList[i].name}
        </Option>
      );
    }
    return (
      <div>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={visible}
        >
          <p style={{ ...pStyle, marginBottom: 24 }}>{formatMessage({ id: 'app.image.edit' })}</p>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.listTitle' })}
                content={editSource.name}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.oldTitle' })}
                content={editSource.name}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.sourceName' })}
                content={editSource.source_name}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.sourceURL' })}
                content={editSource.source_link}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.publicTime' })}
                content={editSource.release_date}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                onMouseEnter={ev => {
                  this.onMouseEnterHandle.bind('tag');
                }}
                title={formatMessage({ id: 'app.content.contentTag' })}
                content={
                  //  (
                  //   editSourceList.tags&&
                  //    Object.values(editSourceList.tags).map((item)=>{
                  //       return (<Tag color="green" key={item}>{item}</Tag>)
                  //   }))
                  editSourceList.tags && (
                    <Select
                      mode="multiple"
                      // size={size}
                      placeholder="Please select"
                      defaultValue={Object.keys(editSourceList.tags)}
                      onChange={this.handleChange}
                      style={{ width: '200px', display: 'inline-block' }}
                    >
                      {children}
                    </Select>
                  )
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.publicState' })}
                content={editSource.country_name}
              />
            </Col>
            <Col span={6}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.definition' })}
                content={editSource.definition_name}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.rate' })}
                content={
                  <Input
                    onChange={this.inputOnchangeHandle}
                    defaultValue={editSourceList.score}
                    style={{ width: '200px', display: 'inline-block' }}
                  />
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.mins' })}
                content={`${editSource.duration}${formatMessage({ id: 'app.glob.minute' })}`}
              />
            </Col>

            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.beseCategory' })}
                content={editSource.type_name}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.director' })}
                content={
                  editSource.directors &&
                  Object.values(editSource.directors).map(item => {
                    return <span key={item}>{item}</span>;
                  })
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.actor' })}
                content={
                  editSource.actors &&
                  Object.values(editSource.actors).map(item => {
                    return <span key={item}>{item},</span>;
                  })
                }
              />
            </Col>
          </Row>
          <Row>
            <DescriptionItem
              title={formatMessage({ id: 'app.content.subtitle' })}
              content={
                editSource.subtitle &&
                Object.keys(editSource.subtitle).map(item => {
                  return (
                    <Tag color="green" key={item}>
                      {item}
                    </Tag>
                  );
                })
              }
            />
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.intro' })}
                content={editSource.description}
              />
            </Col>
          </Row>
          <Divider />
          <p style={pStyle}>{formatMessage({ id: 'app.content.content' })}</p>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title={formatMessage({ id: 'app.content.cover' })}
                content={
                  <img src={editSource.covers} style={{ width: '100px', height: '130px' }} />
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {all_episode.length && (
                <DescriptionItem title={formatMessage({ id: 'app.content.TV' })} content={JUJI} />
              )}
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              {formatMessage({ id: 'app.model.cancel' })}
            </Button>
            <Button onClick={this.onSubmit} type="primary">
              {formatMessage({ id: 'app.model.okText' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ContentEdit;
