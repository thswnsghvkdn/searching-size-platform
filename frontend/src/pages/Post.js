import React from "react"
import { Card } from 'antd'
import { Grid } from "@material-ui/core";
import { textLineBreak } from "./textLineBreak";
import NavTop from "./input/NavTop"
import MainBottom from "./input/MainBottom"
import MainTop from "./input/MainTop"
import NavBottom from "./input/NavBottom"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css'
import {  ListGroup } from 'react-bootstrap'
const apiUrl = "http://127.0.0.1:8000/search/"
const { Meta } = Card


class Post extends React.Component {
    constructor(props) {
        super(props)
        // 메인 검색 컴포넌트에 props로 넘긴 검색 창에서 받은 사이즈 
        this.handleSize = this.handleSize.bind(this);
        // navbar 에서 search 가 이루어질때 input 값으로 키워드와 사이즈값 변경
        this.handleInput = this.handleInput.bind(this);
        // 상의 하의가 바뀔 때 마다 검색창 변경
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

    handleInput(input) {
        this.keyword = input.keyword;
        // size 입력받기 공백이면 -1 값 넣기
        for(let i = 0 ; i < 4 ; i++) {
            this.size[i] = input.size[i] != "" ? input.size[i] : -1;
        }
        this.attendance();
    }

    // 메인 검새 컴포넌트에서 상, 하의 옵션에 따른 검색 컴포넌트 변경  
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

    // 메인 검색 컴포넌트에 props로 넘긴 검색 창에서 받은 사이즈 
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
            this.props.onSearch(<NavTop keyword = {this.keyword} size = {this.size} onInput = {this.handleInput}/>)
        } else {
            this.props.onSearch(<NavBottom keyword = {this.keyword} size = {this.size} onInput = {this.handleInput}/>)
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
                        let imageCard = []
                        for (let i = 0; i < this.state.responseLists.message.length; i++) {
                            // 서버에서 응답받은 가장 적합한 사이즈
                            const title1 = "Outseam " + parseInt(this.state.responseLists.message[i].size[0]) + " Thigh " + parseInt(this.state.responseLists.message[i].size[1]) +"\nWaist " + parseInt(this.state.responseLists.message[i].size[2]) + " Rise " + parseInt(this.state.responseLists.message[i].size[3]);
                            this.t.push(<ListGroup.Item style={{ width: '80%', marginLeft: '0%' }}><a href={this.state.responseLists.message[i].link}><img src={this.state.responseLists.message[i].image} width="100px" style={{ float: 'left' }} /></a><div style={{ marginLeft: '1%' }}>{this.state.responseLists.message[i].title}</div><div style={{ marginTop: '70px', marginLeft: '10%' }}>{this.state.responseLists.message[i].price}원</div></ListGroup.Item>)
                            imageCard.push(<Grid item xs = {12} sm={3}><Card 
                                hoverable 
                                style ={{width : 220 }} 
                                cover = {<a href={this.state.responseLists.message[i].link}><img src ={this.state.responseLists.message[i].image}/></a> }
                                >       
                                    <Meta title={textLineBreak(title1)} description= {Number(this.state.responseLists.message[i].price).toLocaleString() + "￦"} />
                                </Card></Grid> )
                        }
                        this.setState({
                            listItem: imageCard,
                        })
                    })
             
    }
    

    render = () => {
        return (
            <div>
                <div class="parent" style={{  height: '300px' }} >
                    {/* 입력창 , 검색 후에는 navbar로 올린다 */}
                    {this.state.inputSearch} 
                    <div class="parent2" style={{ }}>
                        {/* <ListGroup style={{ transform: 'translate(15% )', marginTop: '10%' }}>
                            {this.state.listItem}
                        </ListGroup> */}
                        <Grid container spacing = {1} >
                            {this.state.listItem}      
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}


export default Post;