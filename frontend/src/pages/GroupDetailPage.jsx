import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import ExpenseList from '../components/ExpenseList';
import MemberList from '../components/MemberList';
import BalanceSummary from '../components/BalanceSummary';
import ActivityLog from '../components/ActivityLog';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/api/groups/${id}`);
        setGroup(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch group');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, navigate]);

  const handleAddExpense = async (expenseData) => {
    try {
      const res = await api.post(`/api/groups/${id}/expenses`, expenseData);
      setGroup(res.data);
      toast.success('Expense added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleSettleExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to mark this expense as settled?')) {
      try {
        const res = await api.put(`/api/groups/${id}/expenses/${expenseId}/settle`);
        setGroup(res.data);
        toast.success('Expense settled successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to settle expense');
      }
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const res = await api.post(`/api/groups/${id}/members`, { userId });
      setGroup(res.data);
      toast.success('Member added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const res = await api.delete(`/api/groups/${id}/members/${memberId}`);
        setGroup(res.data);
        toast.success('Member removed successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const generateReport = async () => {
    try {
      const response = await api.get(`/api/groups/${id}/report`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${group.name}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <button
          onClick={generateReport}
          className="flex items-center bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          <DocumentTextIcon className="h-5 w-5 mr-1" />
          Generate Report
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{group.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{group.description || 'No description'}</p>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            {group.members.length} members
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            {group.expenses.length} expenses
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <BalanceSummary members={group.members} />
      </div>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'expenses' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'members' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'activity' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>
      
      {activeTab === 'expenses' && (
        <ExpenseList
          expenses={group.expenses}
          members={group.members}
          onAddExpense={handleAddExpense}
          onSettleExpense={handleSettleExpense}
        />
      )}
      
      {activeTab === 'members' && (
        <MemberList
          members={group.members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}
      
      {activeTab === 'activity' && (
        <ActivityLog activities={group.activities} />
      )}
    </div>
  );
};

export default GroupDetailPage;