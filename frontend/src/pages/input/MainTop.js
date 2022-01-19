import { React, useState} from "react"
import { Button, Form } from 'react-bootstrap'
import { Select  } from 'antd';
import { useAppContext } from "../../store";
import Axios from "axios"
const { Option } = Select;


function MainTop (props) {
    // dispatch = useAppContext();
    // const { store : { jwtToken }  } = useAppContext();
    
    
    let keyword = "" // 검색 키워드
    let size = [-1, -1, -1, -1] // 하의 사이즈 값
    let [recommand , setRecommand]  = useState( ["" , "" , "" , ""] )


    if( props != undefined )
     {
        if(props.userId.length > 0){   
            const name = props.userId
            recommandSize(name)
            //setRecommand(["2", "@", "@", "2"])
        }
    }
    async function recommandSize(name) {
        const response = await Axios.post("http://localhost:8000/accounts/recommand/",{
                'username' : name,
            })
        
        console.log(response)
        recommand = ["" , "" , "" ,""]
        recommand[0] = `(${response.data.back})`
        recommand[1] = `(${response.data.shoulder})`
        recommand[2] = `(${response.data.chest})`
        recommand[3] = `(${response.data.arm})`
        setRecommand([`추천 : ${parseInt(response.data.back)}`, `(${parseInt(response.data.shoulder)})` , `(${parseInt(response.data.chest)})` ,`(${parseInt(response.data.arm)})`])
    }

    return (
        <>
            <Form style={{ transform: 'translate(40% , 10%)' }}>
                <Select name='cloth' defaultValue="상의" style={{ width: 120 , marginBottom : '1%' , marginLeft : '0.5%'}} onChange={function() {props.onOption("B")}}>
                    <Option value="상의">상의</Option>
                    <Option value="하의">하의</Option>
                </Select>
                <Form.Control type="text" placeholder="검색 하세요" onChange={function (e) {  keyword = e.target.value } } style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder={"총장 " + recommand[0]} onChange={function (e) { size[0] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder={"어깨너비 " + recommand[1] }onChange={function (e) { size[1] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder= {"가슴단면 " + recommand[2] } onChange={function (e) { size[2] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Form.Control type="text" placeholder= {"소매길이 " + recommand[3] }onChange={function (e) { size[3] = Number(e.target.value) }} style={({ margin: '0.5rem', width: '200px' })} />
                <Button multiple onClick = {function() { props.onSearch(size , keyword)} } style={{ margin: '0.5rem', width: '200px' }}>검색</Button>
            </Form>
        </>
    );

}


export default MainTop;