const colors = require('colors');

// logger middleware
const logger = (req, res, next) => {
    const methodColours = {
        GET: 'green',
        POST: 'blue',
        PUT: 'yellow',
        DELETE: 'red',
    };
    const colour = methodColours[req.method] || colors.white;

    console.log(
        `${req.method}\t${req.protocol}://${req.get('host')}${req.originalUrl}` [
            colour
        ]
    );
    next();
}

module.exports = logger;