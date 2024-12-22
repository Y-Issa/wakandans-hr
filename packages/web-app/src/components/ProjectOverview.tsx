const ProjectOverview = () => {
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      progress: '80%',
      team: 'UX/UI Team',
      status: 'In Progress',
    },
    {
      id: 2,
      name: 'Mobile App Launch',
      progress: '60%',
      team: 'Development Team',
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      progress: '100%',
      team: 'Marketing Team',
      status: 'Completed',
    },
    {
      id: 4,
      name: 'Backend API Upgrade',
      progress: '70%',
      team: 'Backend Team',
      status: 'In Progress',
    },
  ];

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-semibold mb-4'>Projects Overview</h1>
      <div className='flex flex-wrap gap-4'>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex-1 min-w-[200px] max-w-[300px] p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow ${
              project.status === 'Completed'
                ? 'bg-gradient-to-br from-green-100 to-white'
                : 'bg-gradient-to-br from-blue-50 to-white'
            }`}
          >
            <h2 className='text-lg font-medium text-gray-700 mb-2'>
              {project.name}
            </h2>
            <p className='text-sm text-gray-500 mb-1'>
              <strong>Progress:</strong> {project.progress}
            </p>
            <p className='text-sm text-gray-500 mb-1'>
              <strong>Team:</strong> {project.team}
            </p>
            <p
              className={`text-sm font-semibold ${
                project.status === 'Completed'
                  ? 'text-green-600'
                  : 'text-blue-600'
              }`}
            >
              {project.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectOverview;
