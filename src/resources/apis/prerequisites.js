import { format_error } from "./utils"
import { http_all } from "."

let prerequisites = {
  endpoint: '/prerequisite',

  get: function () {
    let url = this.endpoint + "/"
    return new Promise((resolve, reject) => {
      http_all.get(url)
        .then(
          response => resolve(response.data),
          error => reject(format_error(error))
        )
    })
  }
}

export default prerequisites