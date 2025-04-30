import { useState, useEffect } from 'react'

const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    // In a real app, this would come from an API
    const mockRecommendations = [
      {
        id: 'r1',
        title: 'Emergency Fund Boost',
        description: 'Consider increasing your emergency fund to cover 6 months of expenses.',
        priority: 'high',
        action: 'Set up automatic transfer'
      },
      // ... other mock recommendations
    ]
    setRecommendations(mockRecommendations)
  }, [])

  return { recommendations }
}

export default useRecommendations;