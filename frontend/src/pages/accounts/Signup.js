import React , {useState} from "react"
import Axios from "axios"
import "antd/dist/antd.css"
import { Form, Input, Button , notification , InputNumber} from "antd"
import { useNavigate } from "react-router-dom"
import { SmileOutlined , FrownOutlined } from "@ant-design/icons"

function Signup() {
    // redirect 용 history const
    const navigate = useNavigate();

    const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
      };
    
    const onFinish = values => {
        async function fn() {
            const { username , password , age , height , weight} = values; 
            const data = { username , password };
            const data2 = {height , weight , age};
            try {
                // 기본 유저 모델로 회원 가입
                const response =  await Axios.post("http://localhost:8000/accounts/signup/", data)
                // 키 나이 등 부가 정보를 가지고 있는 모델로 업데이트 
                await Axios.put("http://localhost:8000/accounts/"+ response.data.pk +"/update/" , data2)
                .then( () => {
                    navigate("/")
                })
                // 성공 알림
                notification.open({
                    message : "회원가입 성공" ,
                    description : "로그인 페이지로 이동합니다.",
                    icon: <SmileOutlined style= {{ color : "#108ee9"}}/>
                });

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
