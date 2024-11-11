import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [toggleLoading, setToggleLoading] = useState(null);
  const navigate = useNavigate();

  // Sorting options
  const sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'email-asc', label: 'Email (A-Z)' },
    { value: 'email-desc', label: 'Email (Z-A)' },
    { value: 'id-asc', label: 'ID (Low to High)' },
    { value: 'id-desc', label: 'ID (High to Low)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'date-desc', label: 'Date (Newest First)' }
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update the employees list
      setEmployees(prev => prev.filter(emp => emp._id !== id));
      
      // Update counts using the response from server
      if (response.data.counts) {
        setTotalCount(response.data.counts.total);
        setActiveCount(response.data.counts.active);
      }
      
      alert('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert(error.response?.data?.message || 'Failed to delete employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
      updateCounts(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCounts = useCallback((employeeData) => {
    setTotalCount(employeeData.length);
    setActiveCount(employeeData.filter(emp => emp.isActive).length);
  }, []);

  // Updated search functionality to include mobile number
  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.f_Name.toLowerCase().includes(searchLower) ||
      employee.f_Email.toLowerCase().includes(searchLower) ||
      employee.f_Id.toString().includes(searchLower) ||
      employee.f_Designation.toLowerCase().includes(searchLower) ||
      employee.f_Mobile.toString().includes(searchTerm) // Added mobile number search
    );
  });

  // Enhanced sorting functionality
  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('-');
    if (key === 'none') {
      setSortConfig({ key: null, direction: 'asc' });
    } else {
      const sortKey = key === 'name' ? 'f_Name' :
                     key === 'email' ? 'f_Email' :
                     key === 'id' ? 'f_Id' :
                     key === 'date' ? 'f_Createdate' : null;
      setSortConfig({ key: sortKey, direction });
    }
  };

  const getSortedEmployees = (employees) => {
    if (!sortConfig.key) return employees;

    return [...employees].sort((a, b) => {
      let aValue = sortConfig.key === 'f_Createdate' 
        ? new Date(a[sortConfig.key]).getTime()
        : sortConfig.key === 'f_Id'
        ? parseInt(a[sortConfig.key])
        : a[sortConfig.key];
      let bValue = sortConfig.key === 'f_Createdate'
        ? new Date(b[sortConfig.key]).getTime()
        : sortConfig.key === 'f_Id'
        ? parseInt(b[sortConfig.key])
        : b[sortConfig.key];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      setToggleLoading(id);
      const token = localStorage.getItem('token');
  
      const response = await axios.patch(
        `http://localhost:5000/api/employees/${id}/toggle-status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { employee: updatedEmployee, counts } = response.data;
  
      setEmployees(prev =>
        prev.map(emp =>
          emp._id === updatedEmployee._id ? updatedEmployee : emp
        )
      );
  
      setTotalCount(counts.total);
      setActiveCount(counts.active);
  
      alert('Employee status updated successfully!');
    } catch (error) {
      console.error('Error toggling status:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Failed to update status'}`);
      } else {
        alert('Failed to update employee status. Please try again.');
      }
    } finally {
      setToggleLoading(null);
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ isActive, onToggle, isLoading }) => (
    <div 
      onClick={isLoading ? undefined : onToggle}
      style={{
        position: 'relative',
        width: '48px',
        height: '24px',
        backgroundColor: isActive ? '#10B981' : '#9CA3AF',
        borderRadius: '12px',
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        opacity: isLoading ? 0.7 : 1,
        display: 'inline-block'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: isActive ? '26px' : '2px',
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: 'left 0.2s ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transform: `scale(${isLoading ? 0.9 : 1})`
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* Stats Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2>Employee List</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Employees</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {totalCount}
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Employees</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
              {activeCount}
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Inactive Employees</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
              {totalCount - activeCount}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search by name, email, mobile, or designation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <select
          onChange={handleSortChange}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#fff',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Mobile</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Designation</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Gender</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Course</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Created Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSortedEmployees(filteredEmployees).map((employee) => (
              <tr key={employee._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{employee.f_Id}</td>
                <td style={{ padding: '12px' }}>
                  {employee.f_Image ? (
                    <img
                      src={`http://localhost:5000${employee.f_Image}`}
                      alt="Employee"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>{employee.f_Name}</td>
                <td style={{ padding: '12px' }}>{employee.f_Email}</td>
                <td style={{ padding: '12px' }}>{employee.f_Mobile}</td>
                <td style={{ padding: '12px' }}>{employee.f_Designation}</td>
                <td style={{ padding: '12px' }}>{employee.f_Gender}</td>
                <td style={{ padding: '12px' }}>{employee.f_Course.join(', ')}</td>
                <td style={{ padding: '12px' }}>{new Date(employee.f_Createdate).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ToggleSwitch 
                      isActive={employee.isActive} 
                      onToggle={() => handleToggleActive(employee._id, employee.isActive)}
                      isLoading={toggleLoading === employee._id}
                    />
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: employee.isActive ? '#dcfce7' : '#fee2e2',
                      color: employee.isActive ? '#166534' : '#991b1b',
                      fontSize: '12px'
                    }}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/edit-employee/${employee._id}`, { state: { employee } })}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        backgroundColor: '#fff'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        color: '#dc2',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;