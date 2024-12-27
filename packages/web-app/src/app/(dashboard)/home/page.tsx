import Announcements from '@/components/Announcements';
import CompanySettingsOverview from '@/components/CompanySettingsOverview';
import EventCalendar from '@/components/EventCalendar';
import PostAnnouncement from '@/components/PostAnnouncement';
import ProjectOverview from '@/components/ProjectOverview';
import TaskList from '@/components/TaskList';

const AdminPage = () => {
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

        {/* DEPARTMENTS */}
        <div className=' bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold '>Departments</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-3'></div>
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

export default AdminPage;
