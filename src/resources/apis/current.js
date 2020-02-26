import { format_error } from "./utils"
import { http_all } from "."

let current = {
    endpoint: '/cleair',
  
    get_current: function () {
      let url = this.endpoint + "/current_map"
      return new Promise((resolve, reject) => {
        http_all.get(url)
          .then(
            response => resolve(response.data),
            error => reject(format_error(error))
          )    
      })
    },
  
  }
  
  export default current 