import React from "react"

import {  Navbar, Nav } from 'react-bootstrap'
import { deleteToken } from "../store";
import {Input  } from "antd";
const {Search } = Input
class AppHeader extends React.Component {
    // dispatch = useAppContext();
    constructor(props) {
        super(props)
    }
    
    // 로그인이 되어있을 경우 사용자 이름 보이기
    checkUser = () => {
        this.dispatch(deleteToken())
    }

    render = () => {
        return (
            <div>
            <Navbar bg="primary" variant="dark" style={{  marginBottom: '2%' }}>
                <Nav >
                    <Nav.Link href="/" >Home</Nav.Link>
                    { this.props.loginState}
                    { this.props.logoutState}
                    {this.props.searchState}
                </Nav>
            </Navbar>

            </div> 
        );

    }
}


export default AppHeader;