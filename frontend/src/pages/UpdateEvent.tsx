import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/CreateEvent.css';

function UpdateEvent() {
  const { eventId } = useParams<{ eventId: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // HTML content for short description
  const [details, setDetails] = useState(''); // HTML content for detailed description
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:7999/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description); // Set the HTML content
        setDetails(data.details); // Set the HTML content for details
        setDate(data.date.split('T')[0]); // Parse date to 'YYYY-MM-DD' format
        setTime(data.time);
        setLocation(data.location);
        setCapacity(data.capacity);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to fetch event details');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to update the event.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description); // Save HTML content
    formData.append('details', details); // Save HTML content for details
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('capacity', capacity);
    if (image) {
      formData.append('image', image); // Only append image if one was selected
    }

    try {
      const response = await fetch(`http://localhost:7999/api/event/${eventId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send form data including file if present
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to update event');
        return;
      }

      navigate(`/event/${eventId}`); // Redirect to event details page after updating
    } catch (err) {
      setError('Error occurred while updating the event.');
    }
  };

  return (
    <div className="create-event-container">
      <h2>Update Event</h2>
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
          <label>Short Description</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            theme="snow"
          />
        </div>
        <div className="quill-container">
          <label>Detailed Description</label>
          <ReactQuill
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
          Update Event
        </button>
      </form>
    </div>
  );
}

export default UpdateEvent;