class ApiError {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ){
       super(message)
       this.statusCode = statusCode;
       this.data = null;//no data shows in the apiError trhough data variable
       this.message = message;
       this.success = false;
       this.errors = errors

       if(statck){
        this.stack = statck
       }
       else{
        Error.captureStackTrace(this, this.constructor)
       }
    }

}


export {ApiError}