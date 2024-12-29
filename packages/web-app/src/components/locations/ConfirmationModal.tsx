interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg p-6 shadow-lg w-96'>
        <h2 className='text-xl font-semibold mb-4'>{title}</h2>
        <p className='text-gray-600 mb-6'>{message}</p>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
