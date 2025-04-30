const GroupList = ({ groups, onGroupClick, onDeleteGroup }) => {
    if (groups.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No groups found. Create one to get started!</p>
        </div>
      )
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {groups.map(group => (
          <div
            key={group.id}
            className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => onGroupClick(group.id)}
          >
            
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-[#6fad4a]">{group.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteGroup(group.id)
                }}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{group.description}</p>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>{new Date(group.createdAt).toLocaleDateString()}</span>
              <span>{group.members.length} members</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  export default GroupList