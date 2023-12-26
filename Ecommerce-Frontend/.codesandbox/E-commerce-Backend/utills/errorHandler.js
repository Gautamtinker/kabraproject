class ErrorHandler extends Error{
    constructor(mes , status){
        super(mes);
        this.statusCode = status;

        Error.captureStackTrace(this, this.constructor);

    }
}

export default ErrorHandler;