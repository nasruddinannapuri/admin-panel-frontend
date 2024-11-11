import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_Gender: '',
    f_Course: '',
    f_Image: null
  });
  const [existingImagePath, setExistingImagePath] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setExistingImagePath(response.data.f_Image);
        
        setFormData({
          ...response.data,
          f_Image: null
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
        alert('Error fetching employee data');
      }
    };

    fetchEmployee();
  }, [id]);

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
        if (key !== 'f_Image') {
          data.append(key, formData[key]);
        }
      });

      if (formData.f_Image) {
        data.append('f_Image', formData.f_Image);
      } else {
        data.append('existingImage', existingImagePath);
      }

      await axios.put(`http://localhost:5000/api/employees/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Employee Updated Successfully');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating employee';
      if (errorMessage.includes('image')) {
        alert('Only image files are allowed!');
      } else {
        alert(errorMessage);
      }
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Edit Employee</h2>
        <button
          onClick={() => navigate('/dashboard')}
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

      {existingImagePath && (
        <div style={{ marginBottom: '15px' }}>
          <p style={{ marginBottom: '5px' }}>Current Image:</p>
          <img
            src={`http://localhost:5000${existingImagePath}`}
            alt="Current employee"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
          />
        </div>
      )}

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
          value={formData.f_Designation}
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
              checked={formData.f_Gender === 'Male'}
              onChange={handleChange}
            /> Male
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="radio"
              name="f_Gender"
              value="Female"
              checked={formData.f_Gender === 'Female'}
              onChange={handleChange}
            /> Female
          </label>
        </div>

        <select 
          name="f_Course" 
          value={formData.f_Course}
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
          <label style={{ display: 'block', marginBottom: '5px' }}>Update Image (optional):</label>
          <input
            type="file"
            name="f_Image"
            onChange={handleChange}
            style={inputStyle}
            accept="image/*" // Only allow image files
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
          Update Employee
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

export default EditEmployee;