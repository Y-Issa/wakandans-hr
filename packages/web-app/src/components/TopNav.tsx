'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineBell,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import useStore from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Home', href: '/home', visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'] },
  {
    label: 'Employees',
    href: '/employees',
    visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  {
    label: 'Departments',
    href: '/departments',
    visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  { label: 'Teams', href: '/teams', visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'] },
  {
    label: 'Holidays',
    href: '/holidays',
    visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
  { label: 'Locations', href: '/locations', visible: ['ADMIN', 'MANAGER'] },
  {
    label: 'Settings',
    href: '/settings',
    visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
  },
];

const TopNav = () => {
  const user = useStore((state) => state.user);
  const pathname = usePathname();
  const role = user?.role || 'EMPLOYEE';

  const items = NAV_ITEMS.filter((item) => item.visible.includes(role));

  return (
    <div className='sticky top-0 z-20 bg-brand-canvas pt-4 px-4 pb-2'>
      <div className='flex items-center gap-4 bg-white rounded-full shadow-sm border border-gray-100 pl-4 pr-2 py-2'>
        {/* Logo */}
        <Link href='/home' className='flex items-center gap-2 shrink-0'>
          <Image src='/logo.png' alt='logo' width={28} height={28} />
          <span className='hidden lg:block font-semibold text-gray-800 text-sm'>
            WakandansHR
          </span>
        </Link>

        {/* Pill nav */}
        <nav className='flex-1 min-w-0 overflow-x-auto hide-scrollbar'>
          <div className='flex items-center gap-1 bg-gray-100 rounded-full p-1 w-max mx-auto'>
            {items.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white shadow'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right icons */}
        <div className='flex items-center gap-2 shrink-0'>
          <Link
            href='/settings'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100'
          >
            <HiOutlineCog6Tooth size={18} />
          </Link>
          <button className='relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100'>
            <HiOutlineBell size={18} />
            <span className='absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-brand-pink text-white rounded-full text-[10px]'>
              1
            </span>
          </button>
          <Link
            href='/logout'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100'
          >
            <HiOutlineArrowRightOnRectangle size={18} />
          </Link>
          <Link
            href={user ? `/employees/${user.id}` : '/home'}
            className='flex items-center gap-2 pl-1'
          >
            <Image
              src={user?.profileImage || '/avatar.png'}
              alt=''
              width={32}
              height={32}
              className='rounded-full object-cover'
            />
            <span className='hidden xl:flex flex-col leading-tight'>
              <span className='text-xs font-medium text-gray-800'>
                {user?.firstName} {user?.lastName}
              </span>
              <span className='text-[10px] text-gray-400'>{user?.role}</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
