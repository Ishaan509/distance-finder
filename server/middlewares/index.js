function handleRequestResponse() {
    return(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        if(process.env.FRONTEND_URL == undefined){
        console.log(0);
        }
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

module.exports = {handleRequestResponse};