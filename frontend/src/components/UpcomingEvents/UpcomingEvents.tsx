import { useEffect, useState } from 'react';
import './UpcomingEvents.css';
import { MdDateRange } from 'react-icons/md';
import { TbClockHour10 } from 'react-icons/tb';
import { Link } from 'react-router-dom';

type Event = {
  _id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  image: string;
};

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:7999/api/event/allEvents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched events:', data);  // Log the fetched data
          if (Array.isArray(data.events)) {
            // Slice the first 3 events to display them
            setUpcomingEvents(data.events.slice(0, 3));
          } else {
            setError('Unexpected data format received from server');
            console.error('Unexpected data format:', data);
          }
        } else {
          setError('Failed to fetch events');
          console.error('Failed to fetch events:', response.statusText);
        }
      } catch (error) {
        setError('Error fetching events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="section-wrapper">
      <div className="section-header">
        <h4>Upcoming Events</h4>
      </div>
      <div className="UpcomingEvents-items">
        {upcomingEvents.map((event) => {
          console.log('Event:', event);  // Log each event
          return (
            <Link to={`/event/${event._id}`} key={event._id} className="UpcomingEvents-item-link">
              <div className="UpcomingEvents-item">
                <div className="card-wrapper">
                  <img className="UpcomingEvents-item-image" src={`http://localhost:7999/${event.image}`} alt={event.title} />
                  <div className="UpcomingEvents-item-content">
                    <h4 className="UpcomingEvents-item-title">
                      {event.title}
                      {/* <span>{event.category}</span> */}
                    </h4>
                    <ul>
                      <li>
                        <MdDateRange /> <span> {event.date}</span>
                      </li>
                      <li>
                        <TbClockHour10 />
                        <span> {event.time}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="UpcomingEvents-button-container">
        <Link to="/allEvents">
          <button className="more-events-button">More Events</button>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingEvents;