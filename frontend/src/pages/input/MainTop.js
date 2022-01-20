import { React, useState ,useEffect} from "react"
import { Button, Form } from 'react-bootstrap'
import { Select  } from 'antd';
import { useAppContext } from "../../store";
import Axios from "axios"
import { ReconciliationFilled } from "@ant-design/icons";
const { Option } = Select;


function MainTop (props) {
    // dispatch = useAppContext();
    // const { store : { jwtToken }  } = useAppContext();
    
    
    let keyword = "" // 검색 키워드
    let size = [-1, -1, -1, -1] // 하의 사이즈 값
    // 추천값 , 로그인 시에 setter 함수가 호출된다.
    let [recommend , setRecommend]  = useState( ["" , "" , "" , ""] )


    // 처음시작과 인수로 준 state 값이 변경 있을 때만 호출되는 useEffect
    useEffect( () =>{
        // 로그인시에 setState 
        if (props.userId.length > 0) {
            recommendSize(props.userId)
        }
    },recommend)// 인수로 넘긴 데이터가 변경될 때만 useEffect는 호출 됨

    // 추천값을 서버에서 받아와 state에 반영하는 함수 
    async function recommendSize(name) {
        const response = await Axios.post("http://localhost:8000/accounts/recommend/",{
                'username' : name,
            })    

        // setState 
        setRecommend([`추천 : ${parseInt(response.data.back)}`, `(${parseInt(response.data.shoulder)})` , `(${parseInt(response.data.chest)})` ,`(${parseInt(response.data.arm)})`])
    }

    return (
        <div style= {{position : "relative" , top :'0' , left : '0' , height : '1000px' , width : '100%' , display : 'inline-block'}}>

            <Form style={{ transform: 'translate(40% , 10%)' }}>
                <Select name='cloth' defaultValue="상의" style={{ width: 120 , marginBottom : '1%' , marginLeft : '0.5%'}} onChange={function() {props.onOption("B")}}>
                    <Option value="상의">상의</Option>
                    <Option value="하의">하의</Option>
                </Select>
                <Form.Control type="text" placeholder="검색 하세요" onChange={function (e) {  keyword = e.target.value } } style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder={"총장 " + recommend[0]} onChange={function (e) { size[0] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder={"어깨너비 " + recommend[1] }onChange={function (e) { size[1] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder= {"가슴단면 " + recommend[2] } onChange={function (e) { size[2] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder= {"소매길이 " + recommend[3] }onChange={function (e) { size[3] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Button multiple onClick = {function() { props.onSearch(size , keyword)} } style={{ margin: '0.5rem', width: '200px' }}>검색</Button>
            </Form>
            <div style = {{transform: 'translate(128% , 20%)' , background : "url(./img/back.png)" , width : "300px" , height : "300px" , backgroundSize : "contain" , backgroundRepeat : 'no-repeat'}}>
                <p style = {{position : "relative" , top : '36%' , left : '14.6%'  , fontFamily : "Fantasy, 궁서 , NanumGothic , Dotum", fontWeight : "bold" , color : "black", fontSize :"28px" , height : "30px" , width : "80px" , textAlign : "center"}}>100</p>
            </div>
        </div>
    );

}



export default MainTop;