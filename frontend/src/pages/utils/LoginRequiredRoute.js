import React from "react";
import { Route , Navigate } from "react-router-dom"
import { useAppContext } from "../../store";


// component : Component (allias 함수안에서는 Component로 사용가능 )
export default function LoginRequiredRoute({ component : Component  , ...kwargs}) {
    const {store : {isAuthenticated} } = useAppContext(); // store 에서 jwtToken의 길이가 0 이상일 경우 참
    return <Route {...kwargs} render={ props =>{
        // 인증이 되지 않았을 경우에만 인수로 들어온 Component로 이동
        if (!isAuthenticated) {
            return <Component {...props} />
        } else {
            return <Navigate to ={{pathname : "/" , state : {from : props.location} }} />
        }
    }} />;
}