class HttpError extends Error {
    constructor(messsage, errorCode){
        super(message); // Add a "message property"
        this.code = errorCode; // Ads a code property
    }
}


module.exports = HttpError;