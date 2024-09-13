import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [events, setEvents] = useState<Event[]>([]);
  // const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  // const [error, setError] = useState('');
  const query = useQuery().get('q'); // Get query string from URL

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:7999/api/event/search?q=${query}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Error fetching search results');
        }

        setEvents(data);
      } catch (error: unknown) {
	if (error instanceof Error) {
	  setError(error.message);
	} else {
	  setError('An unknown error occurred');
	}
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return <p>Loading search results...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (events.length === 0) {
    return <p>No results found for "{query}".</p>;
  }

  return (
    <div className="search-results-container">
      <h1>Search Results for "{query}"</h1>
      {events.map((event) => (
        <div key={event._id} className="search-result-item">
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
