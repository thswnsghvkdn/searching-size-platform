import {React  ,useState } from "react"
import Post from "./Post"
import Login from "./accounts/Login"
import Signup from "./accounts/Signup";
import { Routes , Route, useLocation } from "react-router-dom"; // 도커 module not found 에러 
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import {  Nav } from 'react-bootstrap'
import { useAppContext } from "../store"
import Identicon from 'react-identicons'
import LoginRequiredRoute from "./utils/LoginRequiredRoute";

function Root (props) {
 
  const { dispatch } = useAppContext();
  const {store : { jwtToken }} = useAppContext();
  let isLogin = <Nav.Link href ="/login" >Login</Nav.Link>

  if( jwtToken != undefined && jwtToken.length > 0 ) {
    isLogin = <Nav.Link href = '/' onClick={ function() {dispatch({type : "APP/DELETE_TOKEN"})}}><Identicon size ={20} string ={jwtToken}  fg ={"rgba(255,255,255,.55)"}/></Nav.Link>
  } else {
    isLogin = <Nav.Link href ="/login" >Login</Nav.Link>
  }


  const [loginState , setLogin] = useState(isLogin)
  const [searchState , setSearch] = useState("")




  //  자식 컴포넌트에서 부모 컴포넌트의 props 를 변경하기 위해서는 setter 함수를 전달한다.
  function handleLoginState(newState) {
    setLogin(newState)
  };
  function handleSearchState(newState) {
    setSearch(newState)
  };

  
  const {store : {isAuthenticated} } = useAppContext(); // store 에서 jwtToken의 길이가 0 이상일 경우 참

  return (
    <div>
      {/* 헤더에는 로그인 state와 검색 컴포넌트를 관리하는 search state를 전달한다 */}
      <AppHeader loginState = {loginState} searchState = {searchState}  /> 
        {/* 라우팅 컴포넌트 BrowserRouter -> Routes -> Route 순으로 컴포넌트 구성해야 합니다 */}
        <Routes>
          {/* 검색 중 일 경우 navbar에 검색 창 표시 */}
          <Route path="/" element={<Post onSearch = {handleSearchState} />} />
          {/* 로그인 컴포넌트에는 setter 함수를 전달하여 로그인 시에 props 값을 변경하도록 하였다. */}
          <Route path="login" element = {<Login onLoginChange = {handleLoginState}/>} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      <AppFooter/>
    </div>
  )
}

export default Root;
