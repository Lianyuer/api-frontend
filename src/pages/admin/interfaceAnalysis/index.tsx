import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import TopInvokeInterface from '@/pages/admin/interfaceAnalysis/components/TopInvokeInterface';

const InterfaceAnalysis: React.FC = () => {
  return (
    <PageContainer title="调用次数最多的接口TOP5">
      <TopInvokeInterface />
    </PageContainer>
  );
};
export default InterfaceAnalysis;
