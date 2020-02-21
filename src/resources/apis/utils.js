function format_error(error) {
    console.log('RAW ERROR:', error)
    if (error.response) {
        return error.response.data + ' (' + error.response.status + ')'
    } else {
        return error.message
    }
}

export { format_error }
