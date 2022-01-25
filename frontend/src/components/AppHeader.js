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
    

    render = () => {
        return (
            <div>
            <Navbar bg="primary" variant="dark" style={{  marginBottom: '2%' }}>
                <Nav >
                    <Nav.Link href="/" >Home</Nav.Link>
                    { this.props.loginState}
                    {this.props.searchState}
                </Nav>
            </Navbar>

            </div> 
        );

    }
}


export default AppHeader;