'use client';

import Image from 'next/image';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaBuildingUser, FaUserGroup, FaUsers } from 'react-icons/fa6';
import { HiPlus } from 'react-icons/hi2';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import PillButton from '@/components/ui/PillButton';
import DepartmentBarChart from '@/components/home/DepartmentBarChart';
import RoleDonutChart from '@/components/home/RoleDonutChart';
import HolidaysTrendChart from '@/components/home/HolidaysTrendChart';
import HolidayList from '@/components/home/HolidayList';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const HomePage = () => {
  const {
    totalEmployees,
    totalDepartments,
    totalTeams,
    sampleUsers,
    roleBreakdown,
    departmentHeadcounts,
  } = useDashboardStats();

  return (
    <div className='flex flex-col gap-6 py-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>
          HR Dashboard Overview
        </h1>
        <PillButton href='/employees/new'>
          <HiPlus size={16} />
          New Employee
        </PillButton>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          icon={<FaUsers />}
          color='green'
          label='Employees'
          value={totalEmployees}
          subtext='Active workforce'
          href='/employees'
        />
        <StatCard
          icon={<FaBuildingUser />}
          color='blue'
          label='Departments'
          value={totalDepartments}
          subtext='Company-wide'
          href='/departments'
        />
        <StatCard
          icon={<FaUserGroup />}
          color='pink'
          label='Teams'
          value={totalTeams}
          href='/teams'
          subtext='Manage Teams'
          footer={
            <div className='flex items-center -space-x-2'>
              {sampleUsers.map((user) => (
                <Image
                  key={user.id}
                  src={user.profile?.profileImage || '/avatar.png'}
                  alt=''
                  width={28}
                  height={28}
                  className='rounded-full border-2 border-white object-cover'
                />
              ))}
            </div>
          }
        />
      </div>

      {/* Chart cards */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <ChartCard title='Department Distribution'>
          <DepartmentBarChart data={departmentHeadcounts} />
        </ChartCard>
        <ChartCard title='Role Distribution'>
          <RoleDonutChart roleBreakdown={roleBreakdown} />
        </ChartCard>
        <ChartCard title='Holidays This Year'>
          <HolidaysTrendChart />
        </ChartCard>
      </div>

      {/* Calendar + holidays */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <ChartCard title='Calendar' className='lg:col-span-2'>
          <Calendar className='!border-none w-full' />
        </ChartCard>
        <ChartCard title='Upcoming Holidays'>
          <HolidayList />
        </ChartCard>
      </div>
    </div>
  );
};

export default HomePage;
