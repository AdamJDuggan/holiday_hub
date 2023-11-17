## About
Social media app for families to plan group holidays and share memories.
## Stack
Node.js server built with Express and typescript. MongoDB database queried with GraphQL.
Docker image created to ship to cloud provider. 

## Security
### Authentication
The app uses both server side session cookies AND json web tokens for authentication. Sessions are persisted to a MongoDB database.
### Unsafe headers
Helment middleware is used to remove unsafe headers.
### Prevent large request bodies 
We set limits on the size of json and urlencoded request body. 
### Rate limiter
Non authenticated routes are protected with a rate limiter.

### Running the app
## Run in Dev
`npm run server`
## Build
`rimraf` will remove our old build folder before the typescript compiler emits new code to the dist directory.
