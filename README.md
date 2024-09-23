# Online Event Finder
A platform to create, find, and register for events.  

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [License](#license)

## Project Overview
**Online Event Finder** is a web platform that allows users to create, search, and register for various events. It simplifies the process of finding local or global online events by providing a user-friendly interface where users can register as attendees or organizers. Organizers can create events, upload event images, and manage participant registrations, while attendees can search and register for upcoming events.  

The project includes:

- **Frontend**: Built with React for a dynamic user experience.
- **Backend:** Node.js and Express power the backend, handling all the API requests.
- **Database**: MongoDB is used to store user information, event details, and registrations.
- **Authentication**: JWT-based authentication for security, with Google OAuth integration for ease of use.

## Key Features

- **User Authentication:** Sign up, log in, and log out with JWT authentication or Google OAuth.
- **Event Management**: Users can create, update, and delete their own events.
- **Event Search**: Find events by title using the search bar.
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
- SendGrid for sending confirmation emails
- Vercel for deployment

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**

```
git clone https://github.com/malhaouit/Online_Event_Finder.git
cd Online_Event_Finder
```

2. **Install dependencies:**  
For the backend:  

```
cd backend
npm install
```  

For the frontend:

```
cd ../frontend
npm install
```  

3. **Set up environment variables:** You'll need to configure environment variables for both the frontend and backend.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

**Backend (in the root of the Backend directory, create a .env file):**

```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email>
SENDGRID_API_KEY=<your-sendgrid-api-key>
BASE_URL=<your-backend-base-url>
FRONTEND_URL=<your-frontend-url>
JWT_RESET_SECRET=<your-jwt-reset-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=<your-google-callback-url>
PORT=<your-port-number>
```  

**Frontend (in the root of the frontend directory, create a .env file):**

```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_BASE_URL=http://localhost:7999/api # If running locally
```

## Usage

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

3. **Access the app:** Open your browser and go to http://localhost:5173 to start using the app considering the server port is running on 5173.

## Future Improvements
- **Notifications:** Implement email or in-app notifications for event updates.
- **Mobile Responsiveness:** Improve the mobile design and ensure a seamless experience on smaller devices.
- **Event Categories:** Complete categories to help users filter events by type (e.g., sports, music, education).
- **Event Recommendations:** Use machine learning to recommend events based on user preferences.
- **Payment integration:** Integration with Stripe/PayPal for processing payments securely. 

## License
