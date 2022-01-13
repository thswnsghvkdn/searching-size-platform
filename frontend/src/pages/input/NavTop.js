import React from "react"
import {Input , InputNumber } from "antd";
const {Search } = Input

class NavTop extends React.Component {
    // dispatch = useAppContext();
    constructor(props) {
        super(props)
    }


    render = () => {
        const onSearch = value => console.log(value);

        return (
      <>
            <Search placeholder="input search text" defaultValue={this.props.keyword} allowClear onSearch={onSearch} style={{ width: 200 ,marginLeft : '2%',  marginTop : '0.5%'}} />
                <Input.Group compact style = {{marginTop : "0.5%" , marginLeft : "2%"}}>
                    {/* 메인 검색창에서 받아온 값들로 초기화 */}
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[0] == -1 ? "" : this.props.size[0]} placeholder="어깨" />
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[1] == -1 ? "" : this.props.size[1]} placeholder="가슴"/>
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[2] ==-1 ? "" : this.props.size[2]} placeholder="총길이"/>
                    <InputNumber style={{ width: '20%' }} defaultValue={this.props.size[3] == -1 ? "" : this.props.size[3]} placeholder="소매"/>
                </Input.Group>
            </>
        );

    }
}


export default NavTop;