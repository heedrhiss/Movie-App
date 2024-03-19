import { useEffect } from "react"

export function useKey(key, action){
    useEffect(function (){
        document.addEventListener("keydown",escape)
    
        function escape (e){
          if (e.code === key){
            action()
          }
        }
        return function (e){
          document.removeEventListener("keydown",escape);
        }
      }, [key, action])
}