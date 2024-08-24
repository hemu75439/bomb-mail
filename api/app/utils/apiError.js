class apiError extends Error {
    constructor(
        statusCode,
        message="Oh no!!",
        errors=[],
        stack=''
    )
    {
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.success = false,
        this.message = message,
        this.errors = errors,
        this.stack = stack

        if(stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { apiError }