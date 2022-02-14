import React , {useState} from "react"
import Axios from "axios"
import "antd/dist/antd.css"
import { Card , Form, Input, Button , notification } from "antd"
import {  Nav } from 'react-bootstrap'
import { useNavigate , useLocation } from "react-router-dom"
import { SmileOutlined , FrownOutlined } from "@ant-design/icons"
import { useAppContext } from "../../store"
import {setToken , deleteToken} from "../../store"
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Identicon from 'react-identicons'



function Login(props) {
    // redirect 용 history const
    const navigate = useNavigate();
    const {store : {isAuthenticated} } = useAppContext(); // store 에서 jwtToken의 길이가 0 이상일 경우 참
    // 인증된 유저는 홈으로 보내기
    if (isAuthenticated) {
        window.location.replace("/") // 리로드
    }

    // AppContext 를 연결시킨 useContext
    const { dispatch } = useAppContext();
    // const [jwtToken , setJwtToken] = useLocalStorage("jwtToken", ""); // jwtToken이름으로 저장되면 디폴트 값은 "" 으로 설정
    const [fieldErrors, setFieldErrors] = useState({})
    
    // 리다이렉트 되었을 시에 어디서 왔는지를 기억한다 , 리다이렉트 되지 않았을 경우는 '/'
    const location = useLocation();
    const {from : LoginRedirectUrl } = location.state || {from : {pathname : "/"}}; 

    const onFinish = values => {
        async function fn() {
            const { username , password } = values; 
            const data = { username , password };
            try {
                // 기본 유저 모델로 회원 가입
                const response = await Axios.post("/api/accounts/login/", data)
                // jwt 토큰 값을 response에서 가져온다 
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
 
                // 로그인이 성공한다면 링크를 logout으로 변경
                props.onLoginChange(<Nav.Link href = '/' onClick={ function() {dispatch({type : "APP/DELETE_TOKEN"})}}><Identicon size ={20} string ={jwtToken}  fg ={"rgba(255,255,255,.55)"}/></Nav.Link> , username);                
                navigate('/')


            } catch(error) { // asny await 에서 post 요청이 문제가 생길 경우 에러를 발생시킴
                if(error.response) {
                    // 서버에서 받은 에러메시지를 fieldErrorMessages 로 저장
                    const { data : fieldsErrorMessages } = error.response;   
                    setFieldErrors(
                        // 객체로 들어온 서버 에러메시지 fieldsErrorMessages를 하나씩 분리해서 배열로 배출하는 Object entries , 이후 reduce로 수정된 객체를 useState로 관리하는 fieldErrors에 저장
                        Object.entries(fieldsErrorMessages).reduce((acc , [fieldName , errors]) => {
                            acc[fieldName] = {
                                validateStatus : "error" , // validateStatus는 antdesign rule
                                help : errors.join(" "), // help 는 antdesign rule
                            }
                            return acc;
                        }, {})
                    );
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
        // 서버에서 받은 정보를 antdesign 폼으로 보여주기
        hasFeedback
        {...fieldErrors.username}
        {...fieldErrors.non_field_errors}

        >
        <Input />
        </Form.Item>

        <Form.Item
        label="Password"
        name="password"
 
        rules={[{ required: true, message: 'Please input your password!' }]}
        hasFeedback
        {...fieldErrors.password}
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
