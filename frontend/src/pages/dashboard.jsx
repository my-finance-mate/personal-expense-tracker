import { useState, useEffect } from 'react'
import { Bell, Shield, Clock, Users, Heart, Star } from 'lucide-react'
import useAlerts from '../hooks/useAlerts'
import useRecommendations from '../hooks/useRecommendations'
import OverviewPanel from '../components/dashboard/OverviewPanel'
import AlertsPanel from '../components/dashboard/AlertsPanel'
import RecommendationsPanel from '../components/dashboard/RecommendationsPanel'

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { alerts, unreadCount, markAsRead, filteredAlerts, setAlertFilter } = useAlerts()
  const { recommendations } = useRecommendations()

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Smart Finance Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 border rounded-md dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        <div className="flex mb-6 border-b dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-medium' : ''} dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`relative px-4 py-2 ${activeTab === 'alerts' ? 'border-b-2 border-blue-500 font-medium' : ''} dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            Alerts {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 ${activeTab === 'recommendations' ? 'border-b-2 border-blue-500 font-medium' : ''} dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            Recommendations
          </button>
        </div>

        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'alerts' && <AlertsPanel alerts={filteredAlerts} markAsRead={markAsRead} setAlertFilter={setAlertFilter} />}
        {activeTab === 'recommendations' && <RecommendationsPanel recommendations={recommendations} />}
      </div>
    </div>
  )
}

export default Dashboard