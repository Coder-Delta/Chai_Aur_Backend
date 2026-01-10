# Chai_Aur_Backend

This project is a complex backend project that is built with nodejs, expressjs, mongodb, mongoose, jwt, bcrypt, and many more. This project is a complete backend project that has all the features that a backend project should have.
We are building a complete video hosting website similar to youtube with all the features like login, signup, upload video, like, dislike, comment, reply, subscribe, unsubscribe, and many more.

Project uses all standard practices like JWT, bcrypt, access tokens, refresh Tokens and many more. We have spent a lot of time in building this project and we are sure that you will learn a lot from this project.

<h4>Docker Containerization<h4>

This project supports Docker-based containerization, enabling you to run the VideoTube backend in a fully isolated and consistent environment. Using Docker removes local setup issues and makes development, testing, and deployment easier and more reliable.<br>

<h4> To setup .env file </h4>
Create a .env file in the project root like our sample.env file:<br>
PORT=
MONGODB_URI=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
<br>
After that run<br>
docker run -it -p 3000:3000 --env-file .env coderdelta/videotube
<br>

To understand the complete structure and flow of the project, you can view the full model diagram using the link below:

🔗 Model Diagram (Eraser Workspace)
<h4> https://app.eraser.io/workspace/cVKAxuwbqqOZtOM0wwzX?origin=share</h4>

This diagram includes:
Database models
Relationships between collections
API structure
Authentication flow
Overall system architecture
Use this diagram as a reference to understand how different parts of the project connect and operate together.

To see all API request hit this link =>
<h4> https://coder-delta-7069445.postman.co/workspace/CRUD~bca99257-1145-4e7a-80b7-b466b7b03b3b/collection/48685006-be238b19-e035-4238-b265-6c12681b6c86?action=share&creator=48685006&active-environment=48685006-11560473-c1fa-4f3a-b7b6-d2e7a442b211 </h4>

### Production Backend
https://chai-aur-backend-tib4.onrender.com

