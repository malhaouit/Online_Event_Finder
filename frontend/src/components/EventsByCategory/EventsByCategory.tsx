import './EventsByCategory.css';

import Education_image from '../../assets/Education_image.jpg';
import Food_image from '../../assets/Food_image.jpg';
import Health_image from '../../assets/Health_image.jpg';
import Business_image from '../../assets/Business_image.jpg';
import More_image from '../../assets/More_image.jpg';
import Sport_image from '../../assets/Sport_image.jpg';

const categories = [
    { image: Education_image, title: 'Education' },
    { image: Food_image, title: 'Food' },
    { image: Health_image, title: 'Health' },
    { image: Business_image, title: 'Business' },
    { image: Sport_image, title: 'Sport' },
    { image: More_image, title: 'More' },
];

const EventsByCategory = () => {
  return (
    <div className='section-wrapper'>
      <div className='section-header'>
        <h4>Events By Category</h4>
      </div>
      
      <div className='EventsByCategory-items'>
        {categories.map((category, index) => (
          <div key={index} className='EventsByCategory-item'>
            <img src={category.image} alt={category.title} />
            <h4 className='EventsByCategory-item-title'>{category.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsByCategory;
