import React , {useState} from "react"
import Axios from "axios"
import { Alert } from "antd"

function Signup() {
    // state는 동적인 값을 의미 ,useState()는 배열을 반환하는데 [현재 상태 , Setter 함수]
    const [inputs , setInputs] = useState({});
    const [bodies , setBodies] = useState({});
    // 에러가 있을 경우 사용자에게 보내야 하기 때문에 에러 역시 state로 관리한다.
    const [errors, setErrors] = useState({});
    
    // 가입 버튼을 누르면 axios 로 서버에 전송
    const onSubmit = e => {
        e.preventDefault();
        // 서버로 정보 보내기
        Axios.post("http://localhost:8000/accounts/signup/" , inputs)
            .then(response => {
                console.log("response :" , response);
                // 서버로 부가정보 보내기

                Axios.put("http://localhost:8000/accounts/"+ response.data.pk +"/update/" , bodies)
                .then(response => {
                    console.log("가입완료");
                })
                .catch(error => {
                    console.log("error :" , error);
                });    
            })
            .catch(error => {
                console.log("error :" , error);
                
                if(error.response) {
                    setErrors({
                        username: (error.response.data.username || []).join(" "),
                        password: (error.response.data.password || []).join(" ")
                    });
                }
            });
         
    };

    // input 값이 변화할 때 마다 input state를 setter 함수인 setInput() 으로 저장한다
    const onChange = e => {
        const {name , value} = e.target;
        setInputs( prev  => ({
            ...prev, // 이전에 저장되어있던 값을 참조하기 위해 두 가지 value 이상을 state로 관리하기 때문에 해당 문법이 없으면 하나의 값만 state로 관리 됨
            // name 을 대괄호로 묶어야 const name 을 사용할 수 있다
            [name] : value
        }));
    };

    // 회원의 부가정보 ( 키 , 몸무게 , 나이 )를 저장
    const onChange2 = e => {
        const {name , value} = e.target;
        setBodies( prev  => ({
            ...prev, // 이전에 저장되어있던 값을 참조하기 위해 두 가지 value 이상을 state로 관리하기 때문에 해당 문법이 없으면 하나의 값만 state로 관리 됨
            // name 을 대괄호로 묶어야 const name 을 사용할 수 있다
            [name] : value
        }));
    };
  return (
    <div>
        <form onSubmit={onSubmit}>
            <div>
                <input type = "text" name = "username" onChange ={onChange} />
                {errors.username && <Alert type = "error" message = {errors.username} />}
            </div>
            <div>
                <input type = "password" name = "password" onChange ={onChange} />
                {errors.password && <Alert type = "error" message = {errors.password} />}
            </div>
            <div>
                <input type = "number" name = "height" onChange ={onChange2} />
            </div>
            <div>
                <input type = "number" name = "weight" onChange ={onChange2} />
            </div>
            <div>
                <input type = "number" name = "age" onChange ={onChange2} />
            </div>
            <input type = "submit" value = "회원가입" />
        </form>
    </div>
  );
}

export default Signup;
