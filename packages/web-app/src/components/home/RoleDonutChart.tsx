'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#16A34A',
  MANAGER: '#3B82F6',
  EMPLOYEE: '#EC4899',
  HR: '#9CA3AF',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
  HR: 'HR',
};

interface RoleDonutChartProps {
  roleBreakdown: Record<string, number>;
}

const RoleDonutChart = ({ roleBreakdown }: RoleDonutChartProps) => {
  const total = Object.values(roleBreakdown).reduce((a, b) => a + b, 0);
  const data = Object.entries(roleBreakdown)
    .filter(([, count]) => count > 0)
    .map(([role, count]) => ({
      role,
      count,
      label: ROLE_LABELS[role] || role,
      color: ROLE_COLORS[role] || '#9CA3AF',
    }));

  if (total === 0) {
    return <p className='text-sm text-gray-400'>No employee data yet.</p>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative h-40'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              dataKey='count'
              nameKey='label'
              innerRadius={48}
              outerRadius={68}
              paddingAngle={2}
              stroke='#fff'
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.role} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                border: '1px solid #F3F4F6',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
          <span className='text-2xl font-semibold text-gray-900'>
            {total}
          </span>
          <span className='text-xs text-gray-400'>Employees</span>
        </div>
      </div>

      <ul className='flex flex-col gap-2'>
        {data.map((entry) => (
          <li
            key={entry.role}
            className='flex items-center justify-between text-sm'
          >
            <span className='flex items-center gap-2 text-gray-600'>
              <span
                className='w-2.5 h-2.5 rounded-full shrink-0'
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
            </span>
            <span className='font-medium text-gray-800'>
              {entry.count}/{total}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleDonutChart;
