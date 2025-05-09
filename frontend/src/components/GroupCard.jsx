import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const GroupCard = ({ group, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await api.delete(`/api/groups/${group._id}`);
        toast.success('Group deleted successfully');
        onDelete(group._id);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete group');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/groups/${group._id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-primary">
              {group.name}
            </h3>
          </Link>
          {group.createdBy._id === group.createdBy._id && (
            <div className="flex space-x-2">
              <Link
                to={`/groups/${group._id}/edit`}
                className="text-gray-500 hover:text-primary"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {group.description || 'No description'}
        </p>
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span>{group.members.length} members</span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;