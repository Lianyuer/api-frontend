import { Chart } from '@antv/g2';
import { useEffect, useRef } from 'react';
import { listTopInvokeInterfaceInfoUsingGet } from '@/services/api-backend/analysisController';

export default function TopInvokeInterface() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const dataRef = useRef<{ count: number; item: string; percent: number }[]>(
    [],
  );

  const renderBarChart = (container: HTMLDivElement) => {
    // // 准备数据
    // const data = [
    //   {item: '事例一', count: 40, percent: 0.4},
    //   {item: '事例二', count: 21, percent: 0.21},
    //   {item: '事例三', count: 17, percent: 0.17},
    //   {item: '事例四', count: 13, percent: 0.13},
    //   {item: '事例五', count: 9, percent: 0.09},
    // ];

    const chart = new Chart({
      container,
      autoFit: true, // 添加自动适应
    });

    chart.coordinate({ type: 'theta', outerRadius: 0.8 });

    chart
      .interval()
      .data(dataRef.current)
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
      .animate('enter', { type: 'fadeIn', duration: 200 })
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
      const { data } = await listTopInvokeInterfaceInfoUsingGet(); // 请求接口
      const allInterfaceUsedCount = data.reduce(
        (sum, item) => sum + item.totalNum,
        0,
      );
      dataRef.current = data.map((item) => {
        return {
          item: item.name,
          count: item.totalNum,
          percent: item.totalNum / allInterfaceUsedCount,
        };
      });
      if (isMounted && containerRef.current) {
        chartRef.current = renderBarChart(
          containerRef.current,
          dataRef.current,
        );
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
