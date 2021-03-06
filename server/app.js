var express     = require('express'),
    path        = require('path'),
    settings    = require('./settings'),
    app         = require('libby')(express, settings);

// # Application setup
// Add passport to application.
app.passport = require('./lib/passport')(app);

if (app.settings.env === 'development'){
    // pretty print jade html in development
    app.locals.pretty = true;
}

// Use jade templates located under server/views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Initialize passport
app.use(app.passport.initialize());
app.use(app.passport.session());

// Make some variables always available in templates.
app.use(function(req, res, next){
    res.locals.active_user = req.user;
    res.locals.stamp = app.stamp;
    next();
});

// ## Application routes
// Authentication against google.
app.get('/auth/google', app.passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']}), function(req, res){});
app.get('/auth/google/callback', app.passport.authenticate('google', { failureRedirect: '/login' }), function(req, res){
    var url = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(url);
});

// Core routes like index, login, logout and account.
app.use('/', require('./routes/index'));
var data_routes = require('./routes/data');
app.get('/api/data', data_routes.index);

// Static file middleware serving static files.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Internal server error - 500 status
app.use(function(err, req, res, next){
    console.error("ERROR: %s [%s] %s", req.ip, new Date().toString(), err.message);
    console.error(err.stack);

    res.status(500);
    res.format({
        html: function(){
            res.render('500', {
                error: err.message,
                status: err.status || 500
            });
        },

        json: function(){
            res.json(500, {
                error: err.message,
                status: err.status || 500
            });
        }
    });
});

// File not found - 404 status
app.use(function(req, res, next){
    res.status(404);
    res.format({
        html: function(){
            res.render('404', {
                status: 404,
                error: 'file not found',
                url: req.url
            });
        },

        json: function(){
            res.json(404, {
                status: '404',
                error: 'file not found',
                url: req.url
            });
        }
    });
});

// Export application.
module.exports = app;
