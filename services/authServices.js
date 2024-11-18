import { service } from "../api/api";



export function login(data){
    return service({
        url:'api/login',
        method:'post',
        headers: {
            'Content-Type': 'application/json'
          },
          data

    })
}

export function logout() {
    return service({
      url: 'api/logout',
      method: 'post'
    });
  }