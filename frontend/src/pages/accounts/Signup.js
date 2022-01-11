import React , {useState} from "react"
import Axios from "axios"
import "antd/dist/antd.css"
import { Card, Form, Input, Button , notification , InputNumber} from "antd"
import { useNavigate } from "react-router-dom"
import { SmileOutlined , FrownOutlined } from "@ant-design/icons"
import { useAppContext } from "../../store"
import {setToken } from "../../store"


function Signup() {
    // redirect 용 navigate
    const navigate = useNavigate();


    const {
        store : {jwtToken} ,
        dispatch
    } = useAppContext();

    const validateMessages = {
        required: '꼭 입력해주세요',
        types: {
          number: '숫자로 입력해주세요 ㅜㅜ',
        },
        number: {
          range: '${min} 이상 ${max} 이하로 입력바랍니다 ㅜㅜ',
        },
      };
    
    const onFinish = values => {
        async function fn() {
            // ant-design form 에서 input 태그 입력 값들을 인수로 받을 수 있도록 해준다. 
            const { username , password , age , height , weight} = values; 
            const data = { username , password };
            const data2 = {height , weight , age};
            try {
                // 기본 유저 모델로 회원 가입
                const response = await Axios.post("http://localhost:8000/accounts/signup/", data)
                
                // 토큰 값 요청 
                const response2 =  await Axios.post("http://localhost:8000/accounts/login/", data)
                // jwt 토큰 값 
                const {data : {token : jwtToken}} = response2;
                // response 로 받은 토큰 값을 localStorage에 저장 , store.js 의 jwt setter 함수인 dispatch를 사용한다.
                dispatch(setToken(jwtToken))

                // put 요청은 allow any 가 아니기 때문에 토큰을 통해 인증 해야한다.
                const headers =  { Authorization : `JWT ${jwtToken}`};
                
                // 세번째 인자는 config 로써 헤더 정보를 실을 수 있다.
                await Axios.put("http://localhost:8000/accounts/"+ response.data.pk +"/update/" , data2 , {headers} )
                .then( () => {
                    // 성공 알림
                    notification.open({
                        message : "회원가입 성공" ,
                        description : "검색 페이지로 이동합니다.",
                        icon: <SmileOutlined style= {{ color : "#108ee9"}}/>
                    });
                    window.location.replace("/") // 리로드
                })

            } catch(error) { // asny await 에서 post 요청이 문제가 생길 경우 에러를 발생시킴
                if(error.response) {
                    // 실패 알림
                    notification.open({
                        message : "회원가입 실패" ,
                        description : "아이디/ 암호를 확인해주세요",
                        icon: <FrownOutlined style = {{ color : "#ff3333"}}/>
                    });
                }
            } 
            
        }
        fn();
    }
  return (
      <Card title = "회원가입" >
            <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="off"
            validateMessages={validateMessages}
            style={({ width: '60%' })}
        >
            <Form.Item
            label="Username"
            name="username"
            // 유효성 검사
            rules={[
                { required: true, message: '아이디 입력하셔야죠~' },
                { min : 5 , message : "5글자이상 입력요~" }
                
            ]}
            
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
    
            rules={[{ required: true, message: '비번 입력하셔야죠~' }]}

            >
            <Input.Password />
            </Form.Item>

            <Form.Item name='age' label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
            <InputNumber />
            </Form.Item>

            <Form.Item name= "height" label="Height" rules={[{ type: 'number', min: 0, max: 230 }]}>
            <InputNumber />
            </Form.Item>

            <Form.Item name= "weight" label="Weight" rules={[{ type: 'number', min: 0, max: 300 }]}>
            <InputNumber />
            </Form.Item>



            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit"        style={({ width: '200px' })}>
                Submit
            </Button>
            </Form.Item>
        </Form>
    </Card>
    );
}
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  


export default Signup;
