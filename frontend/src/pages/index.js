import React from "react"
import Post from "./Post"
import Login from "./accounts/Login"
import Signup from "./accounts/Signup";
import { Routes , Route } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import {  Nav } from 'react-bootstrap'



class Root extends React.Component {
  constructor(props) {
    super(props);
    // state 끌어올리기, 헤더 loginState 를 부모 컴포넌트인 root에서 관리
    this.handleLoginState = this.handleLoginState.bind(this);
    this.handleSearchState = this.handleSearchState.bind(this);
    
    
    this.state = { 
      loginState : <Nav.Link href ="/login">Login</Nav.Link>, // 로그인 상태
      searchState : "" , // 검색 중
      userId : ""

    }

  }
  //  자식 컴포넌트에서 부모 컴포넌트의 props 를 변경하기 위해서는 setter 함수를 전달한다.
  handleLoginState(newState, id) {
    this.setState ({
      loginState : newState,
      userId : id
    });
  };

  
  handleSearchState(newState) {
    this.setState ({
      searchState : newState
    });
  };

  render = () =>{ return (
    <div>
      {/* 헤더에는 로그인 state와 검색 컴포넌트를 관리하는 search state를 전달한다 */}
      <AppHeader loginState = {this.state.loginState} searchState = {this.state.searchState} /> 
        {/* 라우팅 컴포넌트 BrowserRouter -> Routes -> Route 순으로 컴포넌트 구성해야 합니다 */}
        <Routes>
          {/* 검색 중 일 경우 navbar에 검색 창 표시 */}
          <Route path="/" element={<Post onSearch = {this.handleSearchState} userId = {this.state.userId} />} />
          {/* 로그인 컴포넌트에는 setter 함수를 전달하여 로그인 시에 props 값을 변경하도록 하였다. */}
          <Route path="login" element={<Login onLoginChange = {this.handleLoginState}/>} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      <AppFooter/>
    </div>
  )};
}

export default Root;
