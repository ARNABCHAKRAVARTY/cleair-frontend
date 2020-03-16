import { format_error } from "./utils"
import { http_all } from "."

let history = {
  endpoint: '/history',

  get_history_data: function (location) {
    if(location!=null) {
    let url = this.endpoint + "/?days=1&location="+location }
    else{
        let url = this.endpoint + "/?days=1" }


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