import React from "react"
import NavTop from "./input/NavTop"
import MainBottom from "./input/MainBottom"
import MainTop from "./input/MainTop"
import NavBottom from "./input/NavBottom"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, ListGroup, Form } from 'react-bootstrap'
import { Select } from 'antd';
const { Option } = Select;
const apiUrl = "http://127.0.0.1:8000/search/"


class Post extends React.Component {
    constructor(props) {
        super(props)
        this.handleSize = this.handleSize.bind(this);
        this.handleOption = this.handleOption.bind(this);

        this.state = {
            names: [],
            listItem: [],
            ordered: [],
            responseLists: [],
            category: [],
            inputSearch : <MainBottom onSearch = {this.handleSize} onOption = {this.handleOption}/> , // 검색창
        }
        this.keyword = ""
        this.ordered = []
        this.size = [-1, -1, -1, -1]
    }
    // 상, 하의 옵션에 따른 검색 컴포넌트 변경  
    handleOption(type) {
       if(type === "T") {
            this.setState({
                inputSearch : <MainTop onSearch = {this.handleSize} onOption = {this.handleOption}/>
            })
        } else {
            this.setState({
                inputSearch : <MainBottom onSearch = {this.handleSize} onOption = {this.handleOption}/>
            })
        }
    }

    // props로 넘긴 검색 창에서 받은 사이즈 
    handleSize(newSize , keyword  ) {
        
        this.size = newSize;
        this.keyword = keyword
        
        // 키워드가 있을 경우 검색 함수 호출
        if(this.keyword) {
            this.setState({
                inputSearch : ""
            })
         this.attendance();
  
        }
    };

    cloth = "" // 상의, 하의 선택 구분
    t = []
    c = [] // 동적 검색창
    checkSame = (ar, index) => { // 사이즈 차이의 최솟값을 반환하는 함수
        let stand = -1;
        for (let i = 0; i < ar.length; i++) {
            let t = Math.abs(this.size[index] - ar[i]) // 해당 사이즈와 선호사이즈의 차이
            if (stand === -1 || stand > t) // 차이의 최솟값을 갱신한다.
                stand = t;
        }
        return stand;
    }
    makeList = () => {
        this.setState({
            listItem: [],
        })
        let copy = []
        for (let i = 0; i < this.state.names.length; i++) {
            let obj = { val: 0, index: i };
            copy.push(obj)
        }
        this.ordered = copy;
        if (this.size[0] === -1 && this.size[1] === -1 && this.size[2] === -1)
            return;
        let ar = []
        let answer = []

        // 응답받은 모델들의 사이즈에 대해 각 모델마다 차이를 저장한다.

        for (let i = 0; i < this.state.names.length; i++) {
            let stand = 0;
            let obj = { val: 0, index: 0 } // 사이즈 차이와 인덱스를 저장한다.
            let cnt = 0;
            ar = this.state.names[i].array; // 각 모델의 특정 사이즈 배열 , 총장 , 밑위 , 허벅지 ..
            for (let j = 0; j < 4; j++) {
                if (j === 1) continue;
                if (this.size[j] === -1) continue;
                stand += this.checkSame(ar[j], j) // 입력받은 특정 사이즈에 대한 차이의 최솟값 반환 받음
                cnt += 1;
            }
            if (stand !== 0)
                stand /= cnt; // 각 사이즈 들에 대한 오차의 평균
            obj.val = stand;
            obj.index = i;
            answer.push(obj)
        }

        answer.sort(function (a, b) { // 사이즈의 차이를 기준으로 오름차순 정렬
            return a.val - b.val;
        })
        this.ordered = answer;
    }
    // 사이즈 필터링 검색 
    attendance = () => {
        if(this.cloth === "상의"){
            // 키워드와 사이즈 value props로 넘기기
            this.props.onSearch(<NavTop keyword = {this.keyword} size = {this.size}/>)
        } else {
            this.props.onSearch(<NavBottom keyword = {this.keyword} size = {this.size}/>)
        }

        Axios.post(apiUrl, { keyword: this.keyword, os: this.size[0], th: this.size[1], ws: this.size[2], rs: this.size[3], })
                    .then(response => {
                        // 오차를 기준으로 오름차순 정렬된 리스트를 응답받는다.
                        this.setState({
                            responseLists: response.data,
                        })
                        // this.makeList();
                        // 리스트 추가
                        this.t = []
                        for (let i = 0; i < this.state.responseLists.message.length; i++) {
                            this.t.push(<ListGroup.Item style={{ width: '80%', marginLeft: '0%' }}><a href={this.state.responseLists.message[i].link}><img src={this.state.responseLists.message[i].image} width="100px" style={{ float: 'left' }} /></a><div style={{ marginLeft: '1%' }}>{this.state.responseLists.message[i].title}</div><div style={{ marginTop: '70px', marginLeft: '10%' }}>{this.state.responseLists.message[i].price}원</div></ListGroup.Item>)
                        }
                        this.setState({
                            listItem: this.t,
                        })
                    })
             
    }
    

    render = () => {
        return (
            <div>

                <div class="parent" style={{ width: '100%', height: '300px' }} >
                    {/* 입력창 , 검색 후에는 navbar로 올린다 */}
                    {this.state.inputSearch} 
                    <div class="parent2" style={{ width: '100%' }}>
                        <ListGroup style={{ transform: 'translate(15% )', marginTop: '10%' }}>
                            {this.state.listItem}
                        </ListGroup>
                    </div>
                </div>

            </div>
        );
    }
}


export default Post;