import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Table = ({ 
  columns, 
  data = [], // Default to empty array
  actions = [], 
  emptyMessage = "No data found",
  className = "",
  loading = false
}) => {
  // Ensure data is always an array
  const tableData = Array.isArray(data) ? data : [];
console.log(tableData,"thsi is tableData")
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Loading data...</p>
      </div>
    );
  }

  // Log for debugging
  if (!Array.isArray(data)) {
    console.warn('Table component received non-array data:', data);
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              tableData.map((item, rowIndex) => (
                <tr key={item.id || item._id || rowIndex} className="hover:bg-green-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex}
                      className={`px-6 py-4 text-sm ${column.className || 'text-gray-900'}`}
                    >
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                 {actions.length > 0 && (
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                     <div className="flex gap-2">
                       {actions.map((action, actionIndex) => (
                         <button
                           key={actionIndex}
                           onClick={() => action.onClick(item)}
                           className={`p-1 rounded transition-colors ${action.className || ''}`}
                           title={action.title}
                           disabled={action.disabled && action.disabled(item)}
                         >
                           {action.icon}
                         </button>
                       ))}
                     </div>
                   </td>
                 )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;