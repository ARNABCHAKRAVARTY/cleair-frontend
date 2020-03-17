import { format_error } from "./utils"
import { http_all } from "."

let history = {
  endpoint: '/history',

  get_history_data: function (location) {
    console.log('GET_HISTORY_DATA', location)
    let url = null
    if (location != null) {
      url = this.endpoint + "/?days=1&location=" + location
    }
    else {
      url = this.endpoint + "/?days=1"
    }
    console.log('GET_HISTORY_DATA', url)    


    return new Promise((resolve, reject) => {
      http_all.get(url)
        .then(
          response => resolve(response.data),
          error => reject(format_error(error))
        )
    })
  },

}

export default history