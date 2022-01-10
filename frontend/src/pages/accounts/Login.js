import React , {useState} from "react"
import Axios from "axios"
import "antd/dist/antd.css"
import { Form, Input, Button , notification , InputNumber} from "antd"
import {  Nav } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import { SmileOutlined , FrownOutlined } from "@ant-design/icons"

function Login() {
    // redirect 용 history const
    const navigate = useNavigate();

    
    const onFinish = values => {
        async function fn() {
            const { username , password } = values; 
            const data = { username , password };
            try {
                // 기본 유저 모델로 회원 가입
                await Axios.post("http://localhost:8000/accounts/login/", data)
               
                // 성공 알림
                notification.open({
                    message : "로그인 성공" ,
                    description : "검색 페이지로 이동합니다.",
                    icon: <SmileOutlined style= {{ color : "#108ee9"}}/>
                });
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
    <div >
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
    </div>
    );
}

  


export default Login;
