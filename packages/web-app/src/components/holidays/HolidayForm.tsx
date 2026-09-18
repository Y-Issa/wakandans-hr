interface HolidayFormProps {
  formData: {
    id: number;
    name: string;
    fromDate: string;
    toDate: string;
  };
  loading: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const HolidayForm: React.FC<HolidayFormProps> = ({
  formData,
  loading,
  handleChange,
  handleSubmit,
}) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString().split('T')[0];
  };

  return (
    <div className='w-full lg:w-1/3 bg-white p-6 shadow-sm rounded-md'>
      <h2 className='text-xl font-medium mb-4'>
        {formData.id ? 'Edit Holiday' : 'Add New Holiday'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Holiday Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <label
              htmlFor='fromDate'
              className='block text-sm font-medium text-gray-700'
            >
              From Date
            </label>
            <input
              type='date'
              id='fromDate'
              name='fromDate'
              value={formatDate(formData.fromDate)}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <label
              htmlFor='toDate'
              className='block text-sm font-medium text-gray-700'
            >
              To Date
            </label>
            <input
              type='date'
              id='toDate'
              name='toDate'
              value={formatDate(formData.toDate)}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <button
            type='submit'
            className='mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : formData.id
                ? 'Update Holiday'
                : 'Add Holiday'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HolidayForm;
