import React from "react"
import {Input , InputNumber } from "antd";
const {Search } = Input

class NavBottom extends React.Component {
    // dispatch = useAppContext();
    constructor(props) {
        super(props)
    }


    render = () => {
        const onSearch = value => console.log(value);

        return (
      <>
            <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 ,marginLeft : '2%',  marginTop : '0.5%'}} />
                <Input.Group compact style = {{marginTop : "0.5%" , marginLeft : "2%"}}>
                    <InputNumber style={{ width: '20%' }} defaultValue="" placeholder="총장" />
                    <InputNumber style={{ width: '20%' }} defaultValue="" placeholder="허벅지"/>
                    <InputNumber style={{ width: '20%' }} defaultValue="" placeholder="허리"/>
                    <InputNumber style={{ width: '20%' }} defaultValue="" placeholder="밑위"/>
                </Input.Group>
            </>
        );

    }
}


export default NavBottom;