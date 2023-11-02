## Security
### Authentication
The app uses both server side session cookies AND json web tokens for authentication. In production sessions are persisted to a Redis database.
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
