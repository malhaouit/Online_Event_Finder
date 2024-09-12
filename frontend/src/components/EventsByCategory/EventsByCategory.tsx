import './EventsByCategory.css'

import Education_image from '../../assets/Education_image.jpg'
import Food_image from '../../assets/Food_image.jpg'
import Health_image from '../../assets/Health_image.jpg'
import Business_image from '../../assets/Business_image.jpg'
import More_image from '../../assets/More_image.jpg'
import Sport_image from '../../assets/Sport_image.jpg'

const EventsByCategory = () => {
  return (
 <div className='section-wrapper'>
    <div className='section-header'>
     <h4> Events By Category</h4>
    </div>
    
    <div className='EventsByCategory-items'>
     <div className='EventsByCategory-item'>
         <div className='card-wrapper'>
             <img className='UpcomingEvents-item-image' src={Education_image}/>
             
         </div>
         <div className='UpcomingEvents-item-content'>
                 <h4 className='EventsByCategory-item-title'>
                     EDUCATION <br />
                    
                 </h4>
                
             </div>
     </div>
     <div className='EventsByCategory-item'>
         <div className='card-wrapper'>
             <img className='UpcomingEvents-item-image' src={Sport_image}/>
             
         </div>
         <div className='UpcomingEvents-item-content'>
                 <h4 className='EventsByCategory-item-title'>
                     SPORT <br />
                    
                 </h4>
                
             </div>
     </div>
     <div className='EventsByCategory-item'>
         <div className='card-wrapper'>
             <img className='UpcomingEvents-item-image' src={Business_image}/>
             
         </div>
         <div className='UpcomingEvents-item-content'>
                 <h4 className='EventsByCategory-item-title'>
                     BUSINESS<br />
                     
                
                 </h4>
                
             </div>
     </div>
     <div className='EventsByCategory-item'>
         <div className='card-wrapper'>
             <img className='UpcomingEvents-item-image' src={Food_image}/>
             
         </div>
         <div className='UpcomingEvents-item-content'>
                 <h4 className='EventsByCategory-item-title'>
                    FOOD<br />
                     
                 </h4>
                
             </div>
     </div>
     <div className='EventsByCategory-item'>
         <div className='card-wrapper'>
             <img className='UpcomingEvents-item-image' src={Health_image}/>
             
         </div>
         <div className='UpcomingEvents-item-content'>
                 <h4 className='EventsByCategory-item-title'>
                    HEALTH<br />
                     
                 </h4>
                
             </div>
     </div>
     <div className='EventsByCategory-item'>
         <div className='card-wrapper'>
             <img className='UpcomingEvents-item-image' src={More_image}/>
             
         </div>
         <div className='UpcomingEvents-item-content'>
                 <h4 className='EventsByCategory-item-title'>
                    MORE <br />
                     
                 </h4>
                
             </div>
     </div>
</div>
</div>
  )
}

export default EventsByCategory