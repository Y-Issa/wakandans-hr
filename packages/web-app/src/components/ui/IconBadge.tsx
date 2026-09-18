import { ReactNode } from 'react';

export type BadgeColor = 'green' | 'blue' | 'pink' | 'neutral';

const COLOR_CLASSES: Record<BadgeColor, string> = {
  green: 'bg-brand-green text-white',
  blue: 'bg-brand-blue text-white',
  pink: 'bg-brand-pink text-white',
  neutral: 'bg-gray-200 text-gray-600',
};

interface IconBadgeProps {
  icon: ReactNode;
  color?: BadgeColor;
  size?: 'sm' | 'md';
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-11 h-11 text-lg',
};

const IconBadge = ({ icon, color = 'blue', size = 'md' }: IconBadgeProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${COLOR_CLASSES[color]} ${SIZE_CLASSES[size]}`}
    >
      {icon}
    </div>
  );
};

export default IconBadge;
