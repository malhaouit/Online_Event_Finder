import './UpcomingEvents.css';

import cyber_security from '../../assets/cyber_security.png';
import Artificial_intelligence from '../../assets/Artificial_intelligence.jpeg';
import Data_science from '../../assets/Data_science.jpg';
import Python_course from '../../assets/Python_course.jpg';
import { MdDateRange } from 'react-icons/md';
import { TbClockHour10 } from 'react-icons/tb';

// Define the Event type
type Event = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  image: string;
};

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Artificial Intelligence course',
    category: 'Education',
    date: '15 Sept 2024',
    time: '9:00',
    image: Artificial_intelligence,
  },
  {
    id: '2',
    title: 'Cyber Security course',
    category: 'Education',
    date: '15 Sept 2024',
    time: '9:00',
    image: cyber_security,
  },
  {
    id: '3',
    title: 'Data Science course',
    category: 'Education',
    date: '15 Sept 2024',
    time: '9:00',
    image: Data_science,
  },
  {
    id: '4',
    title: 'Python Course',
    category: 'Education',
    date: '15 Sept 2024',
    time: '9:00',
    image: Python_course,
  },
];

const UpcomingEvents = () => {
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

      {/* Button Container */}
      <div className="UpcomingEvents-button-container">
        <button className="more-events-button">More Events</button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
