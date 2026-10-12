const express = require('express')
const app = express()
const PORT = 3000

// Convention to add app.use calls together as a group at the top of the file to clearly indicate the order of middleware
// app.use(checkPassword)           // Add this function to the middleware stack for all routes
// app.use('/login', checkPassword) // Add this function to the middleware stack for /login route and children such as /login/admin
// app.use(logger)   // Use the logger middleware for all routes
// app.use(putOnly)  // Use this middleware for all routes but only call if method is PUT

// Middleware using anonymous arrow function but I think named functions are better for readability and reusability
// Output custom req attribute and headers set in logger middleware
// app.use((req, res, next) => {
//   console.log(`Arrow fn middleware. req.tony: ${req.tony}, res.TonyLoggedPath header: ${res.getHeader('loggedPath')}`)
//   next()
// })


// =======================================================================================
// Routes 
// =======================================================================================

// Define a simple route
app.get('/', (req, res) => {
  console.log(`In default route`)
  res.send('In default route')
})

app.get('/login', (req, res) => {
  console.log(`In login route`)
  res.send('Visited login route')
})

app.get('/login/admin', (req, res) => {
  console.log(`In admin route`)
  res.send('Visited /login/admin route')
})

// Calls middleware just on this route before executing route
app.put('/name/:name', logParam, (req, res) => {
  console.log(`In /name/:name route`)
  res.send(`Only called from middleware if a name provided. Name is: ${req.params.name}`)
})

app.post('*', (req, res) => {
  console.log(`In post route`)
  res.send('Called for all post calls if they reach here')
})


// Catch all for any routes not defined - must be last route - i.e. end of the stack
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// =================================== End of routes =====================================================

// Output the middleware stack to the console in a readable format
console.log(`Middleware stack\n================`)
app._router.stack.forEach((layer) => {
  if (layer.route) {
    // Route middleware
    const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ')
    console.log(`Route: ${methods} ${layer.route.path}`)
  } else if (layer.name === 'router') {
    // Router-level middleware (e.g., express.Router())
    console.log(`Router middleware: ${layer.name}`)
  } else {
    // Global middleware
    console.log(`Middleware: ${layer.name}`)
  } 
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

// ========================================================================================
// Named middleware functions - these could be extracted to a module ======================
// ========================================================================================
function checkPassword(req, res, next) {
  const authHeader = req.headers['authorization']
  const pass = 'letmein'

  if (authHeader && authHeader === `${pass}`) {
    console.log('Valid password')
    next()
  } else {
    res.status(401).send('Invalid password') // Unauthorized so don't process any more middleware or route handlers
  }
}

// Middleware function: logs request method and url for all routes
// Demo shows attributes can be added to req and res objects
// res headers can also be set (req headers are read only)
function logger(req, res, next) {
  console.log(`\nlogger output\n=============`)
  req.tony = 'I added attribute to req in middleware to show you can'
  res.set('TonyLoggedPath', `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  console.log(`Called method and URL: ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next() // pass control to the next middleware or route handler
}

// Intercept the /name route only and call this first then call next() to carry on
function logParam(req, res, next) {
  console.log(`Requested name is ${req.params.name}`)
  next() // pass control to the next middleware or route handler
}

// Only execute code if method is PUT
function putOnly(req, res, next) {
  if (req.method === "PUT") {
    console.log(`This is only executed if method is PUT`)
  }
  next()
}