# Middleware
This demo illustrates some basic middleware functionality

It shows:

- Middleware applied to all routes: app.use(checkPassword)

- Middleware applied to one route: app.use('/login', checkPassword)

- Middleware altering req and res before passing on to another route: app.use(logger)

- Middleware responding to a specific http method

- Anonymous middleware responding to all routes

- Middleware responding to a specific route: app.put('/name/:name', logParam, (req, res)

<br>
Note: <b>app.use('/login', checkPassword)</b> and <b>app.get('/login', checkPassword, (req, res)</b> look like they do the same thing in that .get('login' ...) will see checkPassword called either way. However, <b>app.use('/login', checkPassword)</b>, will also call checkPassword for /login, /login/user, /login/admin etc/ so is useful for defining a single parent path but also calling child paths. <b>app.get('/login', checkPassword, (req, res)</b> is very specific and will be called for that specific path only

