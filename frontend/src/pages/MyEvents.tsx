// src/pages/MyEvents.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyEvents.css';
import HomeHeader from '../components/HomeHeader/HomeHeader';
import Footer from '../components/Footer/Footer';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  registeredUsers?: any[];  // Array to hold registered users
}

const MyEvents = () => {
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [currentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Create a navigate instance

  useEffect(() => {
    fetchCreatedEvents(currentPage);
    fetchRegisteredEvents(currentPage);
  }, [currentPage]);

  const fetchCreatedEvents = async (page: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7999/api/event/user/events_created?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setCreatedEvents(data.events);
    } catch (error) {
      console.error('Error fetching created events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async (page: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7999/api/event/user/events_registered?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setRegisteredEvents(data.events);
    } catch (error) {
      console.error('Error fetching registered events:', error);
    }
  };

  return (
    <div className="my-events-page">
      <HomeHeader />

      <div className="my-events-content"> {/* Added content wrapper */}
        <button className="back-button" onClick={() => navigate('/allEvents')}>
          &larr; Back
        </button>

        <h2>My Events</h2>
        {loading && <p>Loading...</p>}

        <div className="events-section">
          <h3>Events I Created</h3>
          <ul>
            {createdEvents.map(event => (
              <li key={event._id}>
                <strong>{event.title}</strong> - {event.date} - {event.location}
                <p>Registered Users: {event.registeredUsers?.length || 0}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="events-section">
          <h3>Events I'm Registered For</h3>
          <ul>
            {registeredEvents.map(event => (
              <li key={event._id}>
                <strong>{event.title}</strong> - {event.date} - {event.location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer /> 
    </div>
  );
};

export default MyEvents;
