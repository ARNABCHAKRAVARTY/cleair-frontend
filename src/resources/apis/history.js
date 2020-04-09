import { format_error } from "./utils"
import { http_all } from "."

let history = {
  endpoint: '/history',

  get_history_data: function (location, days) {
    console.log('GET_HISTORY_DATA:', location, days)
    let url = this.endpoint

    if (days != null) {
      url += "/?days=" + days
    } else {
      url += "/?days=1"
    }

    if (location != null) {
      url += "&location=" + location
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

  get_location_history: function (location, days) {
    console.log('GET_LOCATION_HISTORY:', location, days)
    let url = this.endpoint + '/' + location

    if (days != null) {
      url += "?days=" + days
    } else {
      url += "?days=1"
    }

    console.log('GET_LOCATION_HISTORY [URL]', url)    

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