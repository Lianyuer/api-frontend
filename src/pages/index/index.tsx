import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {DataType} from "csstype";
import {List, message, Skeleton} from "antd";
import {listInterfaceInfoVoByPageUsingPost} from "@/services/api-backend/interfaceInfoController";
import {Link} from "@umijs/max";

const PAGE_SIZE = 8;

const Index: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = 1, pageSize = PAGE_SIZE) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoVoByPageUsingPost({
        current,
        pageSize
      });
      if (res.code === 0) {
        setList(res?.data?.records ?? []);
        setTotal(res?.data?.total ?? 0);
      }
    } catch (e) {
      // 请求失败时提示错误信息
      message.error('请求失败，' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title='在线接口开放平台'>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        loading={loading}
        pagination={{
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: PAGE_SIZE,
          total,
          // 切换页面触发的回调函数
          onChange(page, pageSize) {
            // 加载对应页面的数据
            loadData(page, pageSize);
          },
        }as any}
        renderItem={(item) => (
          <List.Item
            actions={[<Link to={"interfaceInfo/" + item.id}>查看</Link>]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                // href等会要改成接口文档的链接
                title={<a href={"https://ant.design"}>{item.name}</a>}
                description={item.description}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default Index;
