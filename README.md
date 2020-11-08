# projectMERN
Web Apps project in pursuit of MSc

From the root folder:

```
npm run dev
```

React components saved in: ./client/components/

Routes:

// @ route    POST /user/login
// @ desc     Login as a new user
// @ access   Public

// @ route    POST /user/register
// @ desc     Register as a new user
// @ access   Public

// @ route    DELETE /user/remove-user
// @ desc     Remove a user (and associated profile)
// @ access   Private

// @ route    PUT /user
// @ desc     Change password
// @ access   Private

// @ route    GET /library
// @ desc     Get all books
// @ access   Public

// @ route    GET /library/search
// @ desc     Get all books for search critera (to be sent as a query param)
// @ access   Public

// @ route    POST /library
// @ desc     Add a new book to library
// @ access   Private

// @ route    GET /library/:book_id
// @ desc     Get a specific book
// @ access   Public

// @ route    POST /profile
// @ desc     Create a profile
// @ access   Private

// @ route    PUT /profile
// @ desc     Update a profile
// @ access   Private

// @ route    GET /profile/:user_id
// @ desc     Get a profile
// @ access   Public

// @ route    PUT /profile/books/:book_id
// @ desc     Add book to profile
// @ access   Private

// @ route    DELETE /profile/books/:book_id
// @ desc     Remove book from profile
// @ access   Private

// @ route    PUT /profile/image-upload/:user_id
// @ desc     Upload a profile picture
// @ access   Private
