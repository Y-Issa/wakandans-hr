import { ReactNode } from 'react';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import Card from './Card';
import IconBadge, { BadgeColor } from './IconBadge';

interface StatCardProps {
  icon: ReactNode;
  color: BadgeColor;
  label: string;
  value: ReactNode;
  subtext?: ReactNode;
  href?: string;
  footer?: ReactNode;
}

const StatCard = ({
  icon,
  color,
  label,
  value,
  subtext,
  href,
  footer,
}: StatCardProps) => {
  return (
    <Card className='p-5 flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <IconBadge icon={icon} color={color} />
          <span className='text-sm font-medium text-gray-500'>{label}</span>
        </div>
        {href && (
          <a
            href={href}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 shrink-0'
          >
            <HiOutlineArrowUpRight size={14} />
          </a>
        )}
      </div>

      <div className='text-3xl font-semibold text-gray-900'>{value}</div>

      {(subtext || footer) && (
        <div className='flex items-center justify-between'>
          {subtext && <div className='text-xs text-gray-400'>{subtext}</div>}
          {footer}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
