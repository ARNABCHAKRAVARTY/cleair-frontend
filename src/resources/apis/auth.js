import { format_error } from "./utils"
import { http_all } from "."

let auth = {
    endpoint: '/user',

    login: function(item) {
        let url = this.endpoint + "/auth"
        return new Promise( (resolve, reject) => {
            http_all.post(url, item)
                .then(
                    response => resolve(response.data),
                    error => reject(format_error(error))
                )
        })
    }
} 

export default auth
