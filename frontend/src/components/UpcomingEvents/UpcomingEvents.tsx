import { useEffect, useState } from 'react';
import './UpcomingEvents.css';
import { MdDateRange } from 'react-icons/md';
import { TbClockHour10 } from 'react-icons/tb';
import { Link } from 'react-router-dom';

type Event = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  image: string;
};

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:7999/api/event/allEvents?page=1&limit=4', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUpcomingEvents(data.events); // Make sure to access the "events" property from your backend response
        } else {
          console.error('Failed to fetch events:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents(); // Immediately invoke the async function
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="section-wrapper">
      <div className="section-header">
        <h4>Upcoming Events</h4>
      </div>
      <div className="UpcomingEvents-items">
        {upcomingEvents.map((event) => (
          <div className="UpcomingEvents-item" key={event.id}>
            <div className="card-wrapper">
              <img className="UpcomingEvents-item-image" src={event.image} alt={event.title} />
              <div className="UpcomingEvents-item-content">
                <h4 className="UpcomingEvents-item-title">
                  {event.title} <br />
                  <span>{event.category}</span>
                </h4>
                <ul>
                  <li>
                    <MdDateRange /> <span>{event.date}</span>
                  </li>
                  <li>
                    <TbClockHour10 />
                    <span>{event.time}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="UpcomingEvents-button-container">
      <Link to="/moreEvents" >
        <button className="more-events-button">More Events</button>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingEvents;
