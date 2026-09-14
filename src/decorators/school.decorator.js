const schoolDecorator = school => {
    if (!school) return null;

    return {
        id: school.id,
        name: school.name,
    };
};

module.exports = schoolDecorator;
