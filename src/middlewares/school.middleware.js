const requireSchool = (req, res, next) => {
    if(!req.user || !req.user.school || !req.user.school.id){
        return res.status(422).json({ message: 'First, register your school' });
    }
    req.user.school_id = req.user.school.id;

    next();
};

module.exports = { requireSchool };
