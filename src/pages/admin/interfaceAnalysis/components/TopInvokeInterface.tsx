import { Chart } from '@antv/g2';
import { useEffect, useRef } from 'react';
import { listTopInvokeInterfaceInfoUsingGet } from '@/services/api-backend/analysisController';

export default function TopInvokeInterface() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const renderBarChart = (container: HTMLDivElement, chartData: any[]) => {
    const chart = new Chart({
      container,
      autoFit: true, // 添加自动适应
    });

    chart.coordinate({ type: 'theta', outerRadius: 0.8 });

    chart
      .interval()
      .data(chartData)
      .transform({ type: 'stackY' })
      .encode('y', 'percent')
      .encode('color', 'item')
      .legend('color', {
        position: 'bottom',
        layout: { justifyContent: 'center' },
      })
      .label({
        position: 'outside',
        text: (data) => `${data.item}: ${data.percent * 100}%`,
      })
      .animate('enter', { type: 'fadeIn', duration: 150 })
      .tooltip((data) => ({
        name: data.item,
        value: `总调用次数：${data.count}次`,
      }));

    chart.render();
    return chart;
  };

  useEffect(() => {
    let isMounted = true; // 防止组件卸载后更新状态

    async function fetchDataAndInitChart() {
      const res = await listTopInvokeInterfaceInfoUsingGet(); // 请求接口
      const responseData = res.data;
      const allInterfaceUsedCount = responseData.reduce(
        (sum, item) => sum + item.totalNum,
        0,
      );
      const newData = responseData.map((item) => {
        return {
          item: item.name,
          count: item.totalNum,
          percent: (item.totalNum / allInterfaceUsedCount).toFixed(3),
        };
      });
      console.log(newData);
      if (isMounted && containerRef.current) {
        chartRef.current = renderBarChart(containerRef.current, newData);
      }
    }

    fetchDataAndInitChart();

    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []); // 只在挂载时执行

  return (
    <div>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '400px' }} // 设置固定高度
      />
    </div>
  );
}
