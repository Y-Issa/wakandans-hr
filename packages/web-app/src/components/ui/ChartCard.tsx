import { ReactNode } from 'react';
import Card from './Card';

interface ChartCardProps {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

const ChartCard = ({ title, right, children, className = '' }: ChartCardProps) => {
  return (
    <Card className={`p-5 flex flex-col gap-4 ${className}`}>
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-semibold text-gray-800'>{title}</h3>
        {right}
      </div>
      {children}
    </Card>
  );
};

export default ChartCard;
