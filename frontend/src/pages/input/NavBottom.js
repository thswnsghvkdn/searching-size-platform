import React from "react"
import {Input , InputNumber } from "antd";
const {Search } = Input

class NavBottom extends React.Component {
    constructor(props) {
        super(props)
        // post.js 컴포넌트로 넘길 입력 값, render 될 때 넘어온 값들로 초기화 한다
        this.input = {
            keyword : this.props.keyword,
            size : [0,0,0,0]
        }
        this.input.size[0] = this.props.size[0] == -1 ? "" : this.props.size[0];
        this.input.size[1] = this.props.size[1] == -1 ? "" : this.props.size[1];
        this.input.size[2] = this.props.size[2] == -1 ? "" : this.props.size[2];
        this.input.size[3] = this.props.size[3] == -1 ? "" : this.props.size[3];        
    }

    render = () => {
        return (
            <>
            {/* onInput()은 입력값을 post.js로 넘겨 검색함수를 실행하는 props 함수 */}
                <Search placeholder="input search text" defaultValue={this.props.keyword}  allowClear onSearch={ function(){ this.props.onInput(this.input)}.bind(this)} style={{ width: 200 ,marginLeft : '2%',  marginTop : '0.5%'}} onChange={function (e) { this.input.keyword = e.target.value }.bind(this)} />
                <Input.Group compact style = {{marginTop : "0.5%" , marginLeft : "2%"}}>
                    {/* 메인 검색창에서 받아온 값들로 초기화 */}
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[0] == -1 ? "" : this.props.size[0]} placeholder="총장" onChange={function (e) { this.input.size[0] = Number(e) }.bind(this)}/>
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[1] == -1 ? "" : this.props.size[1]} placeholder="허벅지" onChange={function (e) { this.input.size[1] = Number(e) }.bind(this)}/>
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[2] ==-1 ? "" : this.props.size[2]} placeholder="허리" onChange={function (e) { this.input.size[2] = Number(e) }.bind(this)}/>
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[3] == -1 ? "" : this.props.size[3]} placeholder="밑위" onChange={function (e) { this.input.size[3] = Number(e) }.bind(this)}/>
                </Input.Group>
            </>
        );

    }
}


export default NavBottom;