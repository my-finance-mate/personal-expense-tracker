import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import GroupCard from '../components/GroupCard';
import SearchBar from '../components/SearchBar';
import { PlusIcon } from '@heroicons/react/24/solid';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/api/groups');
        setGroups(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      const res = await api.get(`/api/groups/search?name=${term}`);
      setGroups(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed');
    }
  };

  const handleDelete = (groupId) => {
    setGroups(groups.filter(group => group._id !== groupId));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Groups</h1>
        <Link
          to="/groups/create"
          className="flex items-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          New Group
        </Link>
      </div>
      
      <SearchBar value={searchTerm} onChange={handleSearch} />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length > 0 ? (
          groups.map(group => (
            <GroupCard key={group._id} group={group} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm ? 'No groups found matching your search' : 'You have no groups yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;