# projectMERN
Web Apps project in pursuit of MSc


1. Install node modules in the root folder
```
npm install
```
2. Install node modules in client folder
```
cd client
npm install
```
3. Start the API and React servers
```
cd ..
npm run dev
```

## User Guide

**Notes**: 
- Refreshing the brwoser will end the session by removing the user id and JWT web token from local storage.
- Private routes require a JWT token for authentication. The front-end also blocks private URLs if there isn't a JWT token in local storage.
- Errors are dispalyed as alerts by the browser.

### Landing Page

- URL:  http://localhost:3000

- API:  

    - GET http://localhost:5000/library  
    - GET http://localhost:5000/library/search  
    - PUT http://localhost:5000/profile/my-books
    
- Public

- Search for books by keyword. Keywords will be returned from title, author and description. Click on 'Clear' to remove filter.
- Visitors are prompted to sign up
- Logging in allows users to 'Add to books' - their personal collection attached to their profile. When a book is added, the 'Add to books' button shows a tick mark. Trying to add a book again will display a message that 'Book is already added'.

### Register

- URL:  http://localhost:3000/register

- API:  

    - POST http://localhost:5000/users/register

- Public

- Enter name, username, password, and confirm password. Password and confirm password are compared in the front-end. Validations with error response are provided by the API - no blanks, valid email, and minimum 6 characters for password.
- Registering a user returns user id (for routing) and a JWT web token for authentication. Registering also logs in a user. Following registration, the user will be directed to the 'Edit Profile' page.

### Login

- URL:  http://localhost:3000/login

- API:  

    - POST http://localhost:5000/users/login

- Public

- Enter username and password. Validations with error response are provided by the API - no blanks, valid email. Username and password are validated against the stored values and a response of 'Invalid Credentials' is provided if validation fails. 
- Succesful login redirects to the landing page, unless the user hasn't yet set up a profile, in which case they will be redirected to 'Edit Profile'.
- Logginl in will update the Nav Bar to replace 'Login' and 'Register' with 'MyProfile' and 'Logout'.
- The API returns user id (for routing) and a JWT web token for authentication that is saved in the browsers local storage. 

### Edit Profile

- URL:  http://localhost:3000/edit-profile

- API:  
    
    - POST http://localhost:5000/profile  
    - PUT http://localhost:5000/profile

- Private

- Enter about, favourite book, favourite author, and favoutite genre. These are mandatory and are validated by the API for blanks, with error response if validation fails.
- Uploading is profile pic is optional. A blank avatar will be displayed if a user chooses not to upload a profile picture. The profile picture uses the filepond library and stores the image in Mongo as a base64 string.
- Existing users can also edit their profile. Their existing profile details will be set as the default values in the form inputs.
- Updating your profile will redirect a user to their Dashboard.

### Dashboard

- URL:  http://localhost:3000/dashboard

- API:  

    - GET http://localhost:5000/profile/:user_id  
    - DELETE http://localhost:5000/profile/my-books/:book_id

- Private

- The dashboard displays the user profile, including picture, and their books collection.
- Books can be removed from the profile by clicking 'Remove book' on the book card. When a book is removed it will disappear from the dashboard.
- The dashboard also displays options to Change Password and Delete Profile.

### Change Password

- URL:  http://localhost:3000/change-password

- API:  

    - PUT http://localhost:5000/users/change-password

- Private

- Enter current password, new password and confirm new password. The API validates for blanks and a minimum of 6 characters in the password.
- The front end will check that the new password and confirm new password.
- Error response are provided by all validations.
- The API will also validate the hashes of the current password and stored password for the user before it updates the saved password to the new password.

### Delete Account

- URL:  http://localhost:3000/delete-account

- API:  

    - DELETE http://localhost:5000/users/remove-user/:user_id

- Private

- User has option to click 'No way, never!' in case delete was selected by accident. This will redirect the user back to the dashboard.
- Clicking 'Delete my Account' will delete both the profile and the user from storage. All user and session data will be cleared and the user logged out so they can't access any private routes.
- Users are redirected to the Landing Page when they delete their profile.
