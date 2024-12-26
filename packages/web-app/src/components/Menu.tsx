'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaCalendarAlt,
  FaCogs,
  FaFileAlt,
  FaHome,
  FaProjectDiagram,
  FaSignOutAlt,
  FaTasks,
  FaUserCircle,
  FaUserFriends,
} from 'react-icons/fa';
import {
  FaUsers,
  FaBuildingUser,
  FaRegClock,
  FaDollarSign,
} from 'react-icons/fa6';
import useStore from '@/lib/store';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: <FaHome />,
        label: 'Home',
        href: '/home',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaUsers />,
        label: 'Employees',
        href: '/employees',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaBuildingUser />,
        label: 'Departments',
        href: '/departments',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaUserFriends />,
        label: 'Teams',
        href: '/teams',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaProjectDiagram />,
        label: 'Projects',
        href: '/projects',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaTasks />,
        label: 'Tasks',
        href: '/tasks',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaUserCircle />,
        label: 'Clients',
        href: '/clients',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaCalendarAlt />,
        label: 'Calendar',
        href: '/calendar',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaRegClock />,
        label: 'Attendance',
        href: '/attendance',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaDollarSign />,
        label: 'Payroll',
        href: '/payroll',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaFileAlt />,
        label: 'Reports',
        href: '/reports',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaCogs />,
        label: 'Settings',
        href: '/settings',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: <FaUserCircle />,
        label: 'Profile',
        href: '/employees/',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
      {
        icon: <FaSignOutAlt />,
        label: 'Logout',
        href: '/logout',
        visible: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
      },
    ],
  },
];

const Menu = () => {
  const [selected, setSelected] = useState<string>('/home');
  const user = useStore((state) => state.user);
  const role = user?.role || 'EMPLOYEE';

  return (
    <div className='mt-4 text-sm'>
      {menuItems.map((section) => (
        <div className='flex flex-col gap-2' key={section.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              const isProfileItem = item.label === 'Profile';
              const href =
                isProfileItem && user ? `${item.href}${user.id}` : item.href;

              return (
                <Link
                  href={href}
                  key={item.label}
                  className={`flex items-center justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md transition-all duration-300 ease-in-out
                    transform hover:translate-y-[-3px] hover:bg-teal-50 hover:shadow-lg 
                    ${selected === href ? 'bg-teal-100 shadow-xl text-teal-700 font-semibold' : ''}`}
                  onClick={() => setSelected(href)}
                >
                  <span className='text-lg text-teal-600'>{item.icon}</span>
                  <span className='hidden lg:block'>{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
