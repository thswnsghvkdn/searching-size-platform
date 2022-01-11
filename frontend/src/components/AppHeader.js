import React from "react"
import {  Navbar, Nav } from 'react-bootstrap'
import { getStorageItem } from "../pages/utils/useLocalStorage";
import { deleteToken, useAppContext } from "../store";



class AppHeader extends React.Component {
    state = {
        userPage : "",
    }
    // dispatch = useAppContext();
    constructor(props) {
        super(props)
        const jwtToken = getStorageItem("jwtToken" , "");
        if(jwtToken.length > 0){
            this.state = {
                userPage : <Nav.Link href ="/">환영</Nav.Link>,
            }
        } else {
            this.state = {
                userPage : <Nav.Link href ="/login">Login</Nav.Link>,
            }
        }
    }
    // 로그인이 되어있을 경우 사용자 이름 보이기
    checkUser = () => {
        this.dispatch(deleteToken())
    }

    render = () => {
        return (
            <div>

            <Navbar bg="primary" variant="dark" style={{  marginBottom: '2%' }}>
                <Nav className="mr-auto" >
                    <Nav.Link href="/" >Home</Nav.Link>
                    {this.state.userPage}
                </Nav>
            </Navbar>

            </div> 
        );

    }
}


export default AppHeader;