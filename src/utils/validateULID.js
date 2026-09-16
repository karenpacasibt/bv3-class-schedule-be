const validateULID = (ulid) => {
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    return ulidRegex.test(ulid);
};

module.exports = validateULID;