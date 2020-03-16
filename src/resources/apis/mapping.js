import { format_error } from "./utils"
import { http_all } from "."

let mapping = {
    endpoint: 'device_location',

    create: function (payload) {
        let url= this.endpoint + '/'
        return new Promise((resolve, reject) => {
            http_all.post(url, payload)
                .then(
                    response => resolve(response.data),
                    error => reject(format_error(error))
                )
        })
    }

}

export default mapping