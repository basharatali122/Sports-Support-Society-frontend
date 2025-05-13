import React from 'react'

const ParticipantDashboard = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
    <h1 className="text-3xl font-bold mb-6">Participant Dashboard</h1>
  
    {/* Table Container */}
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                profile
              </th>
            
            
            </tr>
          </thead>
        
        </table>
      </div>
    </div>
  </div>
  
  )
}

export default ParticipantDashboard