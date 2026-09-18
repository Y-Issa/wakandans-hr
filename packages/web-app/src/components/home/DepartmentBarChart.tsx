'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { DepartmentHeadcount } from '@/hooks/useDashboardStats';

const PALETTE = ['#16A34A', '#3B82F6', '#EC4899'];
const OVERFLOW_COLOR = '#9CA3AF';

interface DepartmentBarChartProps {
  data: DepartmentHeadcount[];
}

const DepartmentBarChart = ({ data }: DepartmentBarChartProps) => {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  if (data.length === 0) {
    return (
      <p className='text-sm text-gray-400'>No department data available.</p>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <ul className='flex flex-col gap-2'>
        {data.map((department, index) => (
          <li
            key={department.id}
            className='flex items-center justify-between text-sm'
          >
            <span className='flex items-center gap-2 text-gray-600'>
              <span
                className='w-2.5 h-2.5 rounded-full shrink-0'
                style={{
                  backgroundColor: PALETTE[index] || OVERFLOW_COLOR,
                }}
              />
              {department.name}
            </span>
            <span className='font-medium text-gray-800'>
              {Math.round((department.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>

      <div className='h-40'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} barCategoryGap='30%'>
            <XAxis
              dataKey='name'
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #F3F4F6' }}
            />
            <Bar dataKey='count' radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((department, index) => (
                <Cell
                  key={department.id}
                  fill={PALETTE[index] || OVERFLOW_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentBarChart;
