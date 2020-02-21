import { format_error } from "./utils"
import { http_all } from "."

let locations = {
  endpoint: '/location',

  get_locations: function () {
    let url = this.endpoint + "/"
    return new Promise((resolve, reject) => {
      http_all.get(url)
        .then(
          response => resolve(response.data),
          error => reject(format_error(error))
        )
    })
  },

  create: function (item) {
    let url = this.endpoint + "/"
    return new Promise((resolve, reject) => {
      http_all.post(url, item)
        .then(
          response => resolve(response.data),
          error => reject(format_error(error))
        )
    })
  }
}

export default locations