class apiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error = [],
        stack = ""
    )
    {
        super(message)
        this.statusCode = statusCode //Saves the given HTTP status code to the object.
        this.data = null
        this.message = message
        this.success = false
        this.errors = error

        if(stack){
            this.stack = stack
        }
        else{ 
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiError}