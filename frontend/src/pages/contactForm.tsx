import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import '../styles/contactForm.css';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();
  
  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    console.log(data);
    // Here, you can handle the form submission (e.g., send data to a backend service)
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address'
              }
            })}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input 
            id="subject"
            type="text"
            {...register('subject', { required: 'Subject is required' })}
            className={errors.subject ? 'input-error' : ''}
          />
          {errors.subject && <p className="error-message">{errors.subject.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            {...register('message', { required: 'Message is required' })}
            className={errors.message ? 'input-error' : ''}
          />
          {errors.message && <p className="error-message">{errors.message.message}</p>}
        </div>
        
        <div className="form-group">
          <button type="submit" className="submit-button">Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;