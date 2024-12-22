const TaskList = () => {
  const tasks = [
    {
      id: 1,
      name: 'Update Homepage',
      priority: 'High',
      status: 'In Progress',
      team: 'Frontend Team',
    },
    {
      id: 2,
      name: 'Fix Login Bug',
      priority: 'Medium',
      status: 'Pending',
      team: 'Backend Team',
    },
    {
      id: 3,
      name: 'Prepare Marketing Plan',
      priority: 'Low',
      status: 'Completed',
      team: 'Marketing Team',
    },
    {
      id: 4,
      name: 'Optimize Database',
      priority: 'High',
      status: 'In Progress',
      team: 'Database Team',
    },
  ];

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-semibold mb-4'>Task List</h1>
      <ul className='space-y-4'>
        {tasks.map((task) => (
          <li
            key={task.id}
            className='p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-white flex justify-between items-center'
          >
            <div>
              <h2 className='text-lg font-medium text-gray-700 mb-1'>
                {task.name}
              </h2>
              <p className='text-sm text-gray-500'>
                <strong>Team:</strong> {task.team}
              </p>
              <p className='text-sm text-gray-500'>
                <strong>Priority:</strong> {task.priority}
              </p>
            </div>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                task.status === 'Completed'
                  ? 'bg-green-100 text-green-700'
                  : task.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
