const port = process.env.PORT;

module.exports = function(req, res, next) {
    return res.status(200).send(`Status: Health. Container: ${port}`);
};