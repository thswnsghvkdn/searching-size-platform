import React from "react"
import { Spin, Alert } from 'antd';



class LoadingPage extends React.Component {
    // dispatch = useAppContext();
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <>
                <Spin tip="Loading...">
                    <Alert
                    message="잠시만 기다려주세요"
                    description="고객님에게 딱 맞는 사이즈의 제품들을 가져오는 중 입니다."
                    type="info"
                    />
                </Spin>
            </>
        );

    }
}


export default LoadingPage;