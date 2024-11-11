import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_Gender: '',
    f_Course: '',
    f_Image: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && !file.type.startsWith('image/')) {
        alert('Only image files are allowed!');
        e.target.value = ''; // Reset the file input
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
  
      await axios.post('http://localhost:5000/api/employees', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      alert('Employee Created Successfully');
      navigate('/dashboard'); // Navigate to dashboard instead of employee list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating employee';
      if (errorMessage.includes('image')) {
        alert('Only image files are allowed!');
      } else {
        alert(errorMessage);
      }
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Create Employee</h2>
        <button
          onClick={() => navigate('/dashboard')} // Navigate to dashboard
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="f_Name"
          placeholder="Name"
          value={formData.f_Name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="email"
          name="f_Email"
          placeholder="Email"
          value={formData.f_Email}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="text"
          name="f_Mobile"
          placeholder="Mobile"
          value={formData.f_Mobile}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <select 
          name="f_Designation" 
          onChange={handleChange} 
          style={inputStyle}
          required
        >
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>Gender:</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="radio"
              name="f_Gender"
              value="Male"
              onChange={handleChange}
              required
            /> Male
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="radio"
              name="f_Gender"
              value="Female"
              onChange={handleChange}
            /> Female
          </label>
        </div>

        <select 
          name="f_Course" 
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select Course</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="BSC">BSC</option>
        </select>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Upload Image:</label>
          <input
            type="file"
            name="f_Image"
            onChange={handleChange}
            style={inputStyle}
            accept="image/*" // Only allow image files
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Create Employee
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '16px'
};

export default CreateEmployee;
