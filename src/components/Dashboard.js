import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import EmployeeList from './EmployeeList';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleShowEmployeeList = () => {
    setShowEmployeeList(true);
  };

  const handleCreateEmployee = () => {
    navigate('/create-employee');
  };

  return (
    <div style={dashboardStyle}>
      <div style={headerStyle}>
        <h2>Welcome, {username}</h2>
        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      </div>

      <div style={buttonContainerStyle}>
        <button onClick={handleShowEmployeeList} style={buttonStyle}>
          Employee List
        </button>
        <button onClick={handleCreateEmployee} style={buttonStyle}>
          Create Employee
        </button>
      </div>

      {showEmployeeList && <EmployeeList />}
    </div>
  );
}

const dashboardStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
};

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#2563eb',
  color: 'white',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
};

export default Dashboard;
