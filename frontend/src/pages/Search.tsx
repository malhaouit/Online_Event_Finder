import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const [events, setEvents] = useState([]);
  const query = useQuery().get('q'); // Get the search query from the URL

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:7999/api/event/search?q=${query}`);
        const data = await response.json();
        setEvents(data); // Assume the response returns an array of events
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>{event.date}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
}

export default Search;
