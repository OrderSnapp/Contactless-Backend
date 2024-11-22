const apiResponse = (res, statusCode, message, data = null) => {
    const response = {
        status: statusCode < 400 ? 'success' : 'error',
        statusCode,
        message,
    };

    if(data){
        response.data = data;
    }

    return res.status(200).json(response);
}

module.exports = apiResponse;