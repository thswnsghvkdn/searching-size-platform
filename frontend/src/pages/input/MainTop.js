import { React, useState ,useEffect} from "react"
import { Button, Form } from 'react-bootstrap'
import { Select  } from 'antd';
import SizeImage from "./images/SizeImage";
import HumanImage from "./images/HumanImage";
import { useAppContext , setToken } from "../../store";
import Axios from "axios"
import { ReconciliationFilled } from "@ant-design/icons";
const { Option } = Select;


function MainTop (props) {
    const { dispatch } = useAppContext();
    
    const {store : { jwtToken }} = useAppContext();

    let [keyword, setKeyword] = useState("") // 검색 키워드
    let [search , setSearch] = useState([-1, -1, -1, -1]) // 하의 사이즈 값
    // 추천값 , 로그인 시에 setter 함수가 호출된다.
    let [recommend , setRecommend]  = useState( ["" , "" , "" , ""] )
    let [userSize , setSize] = useState([0, 0])
    let [sizeImage , setImage]  = useState(<SizeImage imageUrl = "url(./img/basic.png)"></SizeImage>)
    let [humanImage , setHuman]  = useState("")



    // 처음시작과 인수로 준 state(추천사이즈) 값이 변경 있을 때만 호출되는 useEffect
    useEffect( () =>{
        // 로그인시에 setState 
        if (jwtToken.length > 0) {            
            recommendSize()
        }
    },recommend)// 인수로 넘긴 데이터가 변경될 때만 useEffect는 호출 됨


    // 처음시작과 인수로 준 state(추천사이즈) 값이 변경 있을 때만 호출되는 useEffect
    useEffect( () =>{
        // 로그인시에 setState 
        if (jwtToken.length > 0) {
            setHuman(<HumanImage humanUrl = "url(./img/human.png)" humanHeight = {userSize[0]} humanWeight = {userSize[1]} humanSize = {"를 추천합니다"} />)
        }
    },userSize)


    
    // 추천값을 서버에서 받아와 state에 반영하는 함수 
    async function recommendSize() {

        // 로그인 인증을 위해 토큰을 헤더에 심는다
        const headers =  { Authorization : `Token ${jwtToken}`};
        const response = await Axios.post("http://localhost:8000/accounts/recommend/",{
                'Token' : jwtToken,
            }, {headers})    


        // setState 
        setRecommend([`[ ${parseInt(response.data.back)} ]`, `[ ${parseInt(response.data.shoulder)} ]` , `[ ${parseInt(response.data.chest)} ]` ,`[ ${parseInt(response.data.arm)} ]`])
        setSize([response.data.height , response.data.weight])
    }

    function loginHuman(url , height , weight , recom ) {
        if(jwtToken.length > 0){
            setHuman(<HumanImage humanUrl = {url} humanHeight = {height} humanWeight = {weight} humanSize = {recom} />)
        }
    }


    return (
        <div style= {{height : '100%'  , width : '80%',  display : 'flex' , flexWrap : 'nowrap', justifyContent : 'center', position :'relative',  marginTop : '10px'}}>
            {sizeImage}
            <Form style={{ position : "relative" , top :'0' , left : '5%' , display : "inline-block" }}>
                <Select name='cloth' defaultValue="상의" style={{ width: 120 , marginBottom : '1%' , marginLeft : '0.5%'}} onChange={function() {props.onOption("B")}}>
                    <Option value="상의">상의</Option>
                    <Option value="하의">하의</Option>
                </Select>
                <Form.Control type="text" placeholder="검색 하세요" onChange={function (e) {  setKeyword(e.target.value) } } style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder={"총장 " + recommend[0]} onChange={function (e ) { setSearch([Number(e.target.value) , search[1] , search[2] , search[3] ] ) }} onMouseOver = {function() {setImage(<SizeImage  imageUrl = "url(./img/back.png)"  />); loginHuman("url(./img/humanBack.png)" , userSize[0] , userSize[1] , recommend[0] ) } } style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder={"어깨너비 " + recommend[1] }onChange={function (e ) { setSearch([ search[0] ,Number(e.target.value) , search[2] , search[3] ] ) }} onMouseOver = {function() {setImage(<SizeImage  imageUrl = "url(./img/shoulder.png)"  />); loginHuman("url(./img/humanShoulder.png)" , userSize[0] , userSize[1] , recommend[1] )}}  style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder= {"가슴단면 " + recommend[2] } onChange={function (e) { setSearch([ search[0] ,search[1] , Number(e.target.value) , search[3] ] ) }} onMouseOver = {function() {setImage(<SizeImage  imageUrl = "url(./img/chest.png)"  />); loginHuman("url(./img/humanChest.png)" , userSize[0] , userSize[1] , recommend[2])}} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder= {"소매길이 " + recommend[3] }onChange={function (e) { setSearch([ search[0] ,search[1] , search[2], Number(e.target.value)  ] ) }} onMouseOver = {function() {setImage(<SizeImage  imageUrl = "url(./img/arm.png)"  />); loginHuman("url(./img/humanArm.png)" , userSize[0] , userSize[1] , recommend[3])}} style={({ margin: '0.5rem', width: '200px' })} />
                <Button multiple onClick = {function() { props.onSearch(search , keyword)} } style={{ margin: '0.5rem', width: '200px' }}>검색</Button>
            </Form>
            {humanImage}
        </div>
    );

}



export default MainTop;