// to standardise the error structure 
// we will be using the Error Class of the node.js by extending its functionality

class apiError extends Error{
            //we know it has constuctor but we are creating custom constructor 
            constructor(
                // this section is the argument section in which we are taking all the parameters that are involved in the error section and are very much required to 
                statusCode,
                message = "something went wrong",
                errors= [], //this contains the array of all the errors that are arised and used to display or construct someting
                stack =""  //error stack -read about it
            ){
                // this section is to {overwrite} the constuctor
                //read about {super call}
                super(message)
                this.statusCode = statusCode
                this.data = null //also read about this.data in nodejs 
                this.message = message
                this.success = false // here success code will not be given as we are {handling api errors} not api response
                this.errors = errors

                if(stack){ // to have stack trace to locate the file that causes error
                    this.stack = stack

                }else{
                    Error.captureStackTrace(this,this.constuctor)

                }
            }
}
export {apiError}

//note this : you are handling error in core node.js but the response handling u will be done by express 