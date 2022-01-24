import React , {useState} from "react"
import Axios from "axios"
import "antd/dist/antd.css"
import { Card , Form, Input, Button , notification } from "antd"
import {  Nav } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import { SmileOutlined , FrownOutlined } from "@ant-design/icons"
import { useAppContext } from "../../store"
import {setToken , deleteToken} from "../../store"
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';


function Login(props) {
    // redirect 용 history const
    const navigate = useNavigate();
    // AppContext 를 연결시킨 useContext
    const { dispatch } = useAppContext();
    // const [jwtToken , setJwtToken] = useLocalStorage("jwtToken", ""); // jwtToken이름으로 저장되면 디폴트 값은 "" 으로 설정

    const onFinish = values => {
        async function fn() {
            const { username , password } = values; 
            const data = { username , password };
            try {
                // 기본 유저 모델로 회원 가입
                const response = await Axios.post("http://localhost:8000/accounts/login/", data)
                // jwt 토큰 값 
                const {data : {Token : jwtToken}} = response;
                // response 로 받은 토큰 값을 localStorage에 저장 , store.js 의 jwt setter 함수인 dispatch를 사용한다.
                dispatch(setToken(jwtToken))
                
                // setJwtToken(jwtToken)
                // {data : token} ==  const token = response.data
                // {data : {token}} == const token = response.data.token , 중괄호 하나로 달라지는 차이
                // {data : {token : jwtToken}} == const jwtToken = response.data.token

                // 성공 알림
                notification.open({
                    message : "로그인 성공" ,
                    description : "검색 페이지로 이동합니다.",
                    icon: <SmileOutlined style= {{ color : "#108ee9"}}/>
                });                
                const menu = (
                    <Menu>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="/">
                          your profile
                        </a>
                      </Menu.Item>
                      <Menu.Item danger onClick={dispatch(deleteToken)}>logout</Menu.Item>
                    </Menu>
                  );
                // props 변경
                props.onLoginChange(<Nav.Link><Dropdown overlay={menu}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                 <SmileOutlined />
              </a></Dropdown></Nav.Link> , username);
                navigate('/')


            } catch(error) { // asny await 에서 post 요청이 문제가 생길 경우 에러를 발생시킴
                if(error.response) {
                    // 실패 알림
                    notification.open({
                        message : "로그인 실패" ,
                        description : "아이디/ 암호를 확인해주세요",
                        icon: <FrownOutlined style = {{ color : "#ff3333"}}/>
                    });
                }
            } 
            
        }
        fn();
    }
  return (
    <Card title = "로그인" >
        <Form 
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        style={({ width: '60%' })}
    >
        <Form.Item
        label="Username"
        name="username"
        // 유효성 검사
        rules={[
            { required: true, message: 'Please input your username!' },
            { min : 5 , message : "5글자이상 입력요~" }
        ]}
        
        >
        <Input />
        </Form.Item>

        <Form.Item
        label="Password"
        name="password"
 
        rules={[{ required: true, message: 'Please input your password!' }]}

        >
        <Input.Password />
        </Form.Item>





        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit"        style={({ width: '200px' })}>
            Login
        </Button>
        {/* 회원가입 하이퍼링크 */}
        <Nav>
          <Nav.Link href="signup" >signup</Nav.Link>
        </Nav>
        </Form.Item>
    </Form>
    </Card>
    );
}

  


export default Login;
