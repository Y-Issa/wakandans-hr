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

const role = 'admin';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: <FaHome />,
        label: 'Home',
        href: '/admin',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaUsers />,
        label: 'Employees',
        href: '/employees',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaBuildingUser />,
        label: 'Departments',
        href: '/departments',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaUserFriends />,
        label: 'Teams',
        href: '/teams',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaProjectDiagram />,
        label: 'Projects',
        href: '/projects',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaTasks />,
        label: 'Tasks',
        href: '/tasks',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaUserCircle />,
        label: 'Clients',
        href: '/clients',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaCalendarAlt />,
        label: 'Calendar',
        href: '/calendar',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaRegClock />,
        label: 'Attendance',
        href: '/attendance',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaDollarSign />,
        label: 'Payroll',
        href: '/payroll',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaFileAlt />,
        label: 'Reports',
        href: '/reports',
        visible: ['admin', 'employee', 'manager'],
      },
      {
        icon: <FaCogs />,
        label: 'Settings',
        href: '/settings',
        visible: ['admin', 'employee', 'manager'],
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: <FaUserCircle />,
        label: 'Profile',
        href: '/profile',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <FaSignOutAlt />,
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
];

const Menu = () => {
  const [selected, setSelected] = useState<string>('/');

  return (
    <div className='mt-4 text-sm'>
      {menuItems.map((section) => (
        <div className='flex flex-col gap-2' key={section.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md menu-item ${
                    selected === item.href ? 'selected' : ''
                  }`}
                  onClick={() => setSelected(item.href)}
                >
                  <span className='text-lg text-blue-600'>{item.icon}</span>
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
