import React from "react"
import { Button, Form } from 'react-bootstrap'
import { Select  } from 'antd';
const { Option } = Select;


class MainTop extends React.Component {
    // dispatch = useAppContext();
    constructor(props) {
        super(props)
    }
    keyword = "" // 검색 키워드
    ordered = []
    size = [-1, -1, -1, -1] // 하의 사이즈 값

    render = () => {
        return (
            <>
                <Form style={{ transform: 'translate(40% , 10%)' }}>
                    <Select name='cloth' defaultValue="상의" style={{ width: 120 , marginBottom : '1%' , marginLeft : '0.5%'}} onChange={function() {this.props.onOption("B")}.bind(this)}>
                        <Option value="상의">상의</Option>
                        <Option value="하의">하의</Option>
                    </Select>
                    <Form.Control type="text" placeholder="검색 하세요" onChange={function (e) {  this.keyword = e.target.value }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                    <Form.Control type="text" placeholder="총장" onChange={function (e) { this.size[0] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                    <Form.Control type="text" placeholder="어깨너비" onChange={function (e) { this.size[1] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                    <Form.Control type="text" placeholder="가슴단면" onChange={function (e) { this.size[2] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                    <Form.Control type="text" placeholder="소매길이" onChange={function (e) { this.size[3] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                    <Button multiple onClick = {function() {this.props.onSearch(this.size , this.keyword)}.bind(this) } style={{ margin: '0.5rem', width: '200px' }}>검색</Button>
                </Form>
            </>
        );

    }
}


export default MainTop;