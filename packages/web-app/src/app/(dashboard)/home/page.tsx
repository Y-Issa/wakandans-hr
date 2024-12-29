import Announcements from '@/components/home/Announcements';
import CompanySettingsOverview from '@/components/home/CompanySettingsOverview';
import EventCalendar from '@/components/home/EventCalendar';
import PostAnnouncement from '@/components/home/PostAnnouncement';
import ProjectOverview from '@/components/home/ProjectOverview';
import TaskList from '@/components/home/TaskList';

const HomePage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/2'>
            <CompanySettingsOverview />
            <ProjectOverview />
          </div>

          <div className='w-full md:w-1/2'>
            <PostAnnouncement />
            <TaskList />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8 overflow-scroll hide-scrollbar'>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default HomePage;
