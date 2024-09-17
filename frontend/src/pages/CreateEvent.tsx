import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import '../styles/CreateEvent.css'; // Importing the styles from the separate CSS file
import { HomeHeader } from '../components';
import Footer from '../components/Footer/Footer';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to create an event.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('details', details);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('capacity', capacity);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:7999/api/event/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to create event');
        return;
      }

      navigate('/allEvents'); // Redirect to the landing page after successful event creation
    } catch (err) {
      setError('Error occurred while creating the event.');
    }
  };

  return (
    <>  
    <HomeHeader /> 
     <div className="create-event-container">
      <h2>Create a New Event</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="create-event-form">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="quill-container">
          <label htmlFor="event-description">Short Description</label>
          <ReactQuill
            id="event-description"
            value={description}
            onChange={setDescription}
            theme="snow"
          />
        </div>
        <div className="quill-container">
          <label htmlFor="event-details">Detailed Description</label>
          <ReactQuill
            id="event-details"
            value={details}
            onChange={setDetails}
            theme="snow"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
    <Footer />
    </>

  );
};

export default CreateEvent;
