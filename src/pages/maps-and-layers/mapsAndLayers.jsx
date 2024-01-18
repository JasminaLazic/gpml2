import React from 'react';
import { Layout, Typography } from 'antd';
import 'antd/dist/antd.css'; // Import Ant Design styles

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MapsAndLayers = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Title style={{ color: '#fff' }} level={3}>My React App</Title>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ margin: '100px auto', textAlign: 'center' }}>
          <Title>Hello World</Title>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
    </Layout>
  );
};

export default MapsAndLayers;
