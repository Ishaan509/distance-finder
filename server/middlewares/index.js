function handleRequestResponse() {
    return(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

module.exports = {handleRequestResponse};