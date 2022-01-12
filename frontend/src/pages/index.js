import React from "react"
import Post from "./Post"
import Login from "./accounts/Login"
import Signup from "./accounts/Signup";
import { Routes , Route } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import {  Nav } from 'react-bootstrap'

class Root extends React.Component {
  constructor(props) {
    super(props);
    // state 끌어올리기 헤더 loginState 를 관리
    this.handleLoginState = this.handleLoginState.bind(this);
    this.state = { loginState : <Nav.Link href ="/login">login</Nav.Link>,}
  }
  //  자식 컴포넌트에서 부모 컴포넌트의 state 를 변경하기 위해서는 setter 함수를 전달한다.
  handleLoginState(newState) {
    ;
    this.setState ({
      loginState : newState
    })
  }

  render = () =>{ return (
    <div>
      <AppHeader loginState = {this.state.loginState}/> 
        {/* 라우팅 컴포넌트 BrowserRouter -> Routes -> Route 순으로 컴포넌트 구성해야 합니다 */}
        <Routes>
          <Route path="/" element={<Post />} />
          <Route path="login" element={<Login onLoginChange = {this.handleLoginState}/>} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      <AppFooter/>
    </div>
  )};
}

export default Root;
