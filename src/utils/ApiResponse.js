class ApiResponse {
    constructor(statusCode, message ="sucess",data){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode <400 //we are trying explicitly  to send status code less than 400

    }
}
export{ApiResponse}