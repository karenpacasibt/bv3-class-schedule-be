const schoolDecorator = require('./school.decorator');

const userDecorator = user => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    school: schoolDecorator(user.school),
});

module.exports = userDecorator;
