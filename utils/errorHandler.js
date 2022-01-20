// Error handler class
class ErrorHandler extends Error {
    // Message : Error message
    // Code : Error code
    constructor(message, statusCode){
        // Super stands for the parent class constructor
        // In this case Error class constructor
        super(message)
        this.statusCode = statusCode
        // It will create a stack property on this object
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler;