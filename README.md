# Online Event Finder
A platform to create, find, and register for events.  

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
**Online Event Finder** is a web platform that allows users to create, search, and register for various events. It simplifies the process of finding local or global events by providing a user-friendly interface where users can register as attendees or organizers. Organizers can create events, upload event images, and manage participant registrations, while attendees can search and register for upcoming events.  

The project includes:

- **Frontend**: Built with React for a dynamic user experience.
- **Backend:** Node.js and Express power the backend, handling all the API requests.
- **Database**: MongoDB is used to store user information, event details, and registrations.
- **Authentication**: JWT-based authentication for security, with Google OAuth integration for ease of use.

## Features

- **User Authentication:** Sign up, log in, and log out with JWT authentication or Google OAuth.
- **Event Management**: Users can create, update, and delete their own events.
- **Event Search**: Find events by title, description, or location using the search bar.
- **Profile Management**: Users can upload a profile picture and manage their profile information.
- **Image Upload**: Organizers can upload images for their events.
- **Event Registration**: Users can register for events and cancel their registration if needed.

## Technologies Used

### Frontend:

- React (with React Router)
- CSS for styling
- React Icons for icons

### Backend:

- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for image uploads
- Passport.js and JWT for authentication

### Other Tools:

- Google OAuth for social login
- Nodemailer for sending confirmation emails
- Heroku/AWS for deployment (optional)

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**

```
git clone https://github.com/malhaouit/Online_Event_Finder.git
cd Online_Event_Finder
```

2. **Install dependencies:**  
For the backend:  

````
cd backend
npm install
```  

For the frontend:

```
cd ../frontend
npm install
```  

3. Set up environment variables: You'll need to configure environment variables for both the frontend and backend.

## Environment Variables

**Backend (in the root of the backend directory, create a .env file):** 

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_URL=your_cloudinary_url_for_image_uploads # Optional
```  

**Frontend (in the root of the frontend directory, create a .env file):**

```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_BASE_URL=http://localhost:7999/api # If running locally
```

**Usage**

1. **Run the backend:** Make sure you're in the backend folder and run:

```
npm run dev  
```

2. **Run the frontend:** Open a new terminal, navigate to the frontend folder, and run:

```
npm start
```
Or  
```
npm run dev  
```  

3. **Access the app:** Open your browser and go to http://localhost:3000 to start using the app.

## Future Improvements
- **Notifications:** Implement email or in-app notifications for event updates.
- **Mobile Responsiveness:** Improve the mobile design and ensure a seamless experience on smaller devices.
- **Event Categories:** Add categories to help users filter events by type (e.g., sports, music, education).
- **Event Recommendations:** Use machine learning to recommend events based on user preferences.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.
