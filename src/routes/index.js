const apiRouter = require('./apiRouter');

module.exports = (app) => {
    app.use('/api/v1', apiRouter);
};