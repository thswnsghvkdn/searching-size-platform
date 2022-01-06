import React from "react"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, ListGroup, Form, Navbar, Nav } from 'react-bootstrap'
import { CaretRight, CaretLeft } from 'react-bootstrap-icons'
const apiUrl = "http://127.0.0.1:8000/search/"


class Post extends React.Component {
    state = {
        names: [],
        listItem: [],
        category: [],
    }
    keyword = ""
    ordered = []
    size = [-1, -1, -1, -1]
    constructor(props) {
        super(props)
        this.state = {
            names: [],
            listItem: [],
            ordered: [],
            responseLists: [],
            category: [],
        }
        this.rise = this.thigh = this.outseam = -1
    }
    t = []
    c = []
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
    attendance = () => {
        // 포스트요청에 body들을 보낸다
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
    // 상의와 하의 카테고리 생성
    makeCategory = (e) => {
        this.c = []
        if (e.target.value == "상의") {
            this.c.push(<Form.Control type="text" placeholder="검색 하세요" onChange={function (e) { this.keyword = e.target.value }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="어깨" onChange={function (e) { this.size[0] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="가슴" onChange={function (e) { this.size[1] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="총길이" onChange={function (e) { this.size[2] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="소매" onChange={function (e) { this.size[3] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
        }
        else {
            this.c.push(<Form.Control type="text" placeholder="검색 하세요" onChange={function (e) { this.keyword = e.target.value }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="총장" onChange={function (e) { this.size[0] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="허벅지" onChange={function (e) { this.size[1] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="허리" onChange={function (e) { this.size[2] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)
            this.c.push(<Form.Control type="text" placeholder="밑위" onChange={function (e) { this.size[3] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />)

        }
        this.setState({
            category: this.c,
        })
    }

    render = () => {
        return (
            <div>
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Nav className="mr-auto" >
                            <Nav.Link href="#home" >Home</Nav.Link>
                            <Nav.Link href="#features" >login</Nav.Link>
                        </Nav>
                    </Navbar>
                </div>
                {/* <div style={{ float: 'left' }}>
                    <CaretLeft />
                </div> */}
                <div class="parent" style={{ width: '100%', height: '300px' }} >
                    <Form style={{ transform: 'translate(40% , 10%)' }} > {/* 가운데 정렬을 위한 translate */}
                        <Form.Group >
                            <select name="cloth" onChange={this.makeCategory} >
                                <option value="상의"  >상의</option>
                                <option value="하의"  >하의</option>
                            </select>
                            {this.state.category}
                            {/* <Form.Control type="text" placeholder="검색 하세요" onChange={function (e) { this.keyword = e.target.value }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                            <Form.Control type="text" placeholder="총장" onChange={function (e) { this.size[0] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                            <Form.Control type="text" placeholder="허벅지" onChange={function (e) { this.size[1] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                            <Form.Control type="text" placeholder="허리" onChange={function (e) { this.size[2] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} />
                            <Form.Control type="text" placeholder="밑위" onChange={function (e) { this.size[3] = Number(e.target.value) }.bind(this)} style={({ margin: '0.5rem', width: '200px' })} /> */}
                            <Button multiple onClick={this.attendance} style={({ margin: '0.5rem', width: '200px' })}>검색</Button>
                        </Form.Group>
                    </Form>
                    <div class="parent2" style={{ width: '100%' }}>
                        <ListGroup style={{ transform: 'translate(15% )', marginTop: '10%' }}>
                            {this.state.listItem}
                        </ListGroup>
                    </div>
                </div>

                {/* <div style={{ display: 'inline-block' }}>
                    <CaretRight />
                </div> */}
            </div>
        );
    }
}

/*
                    <input type="text" placeholder="검색하세요" />
                    <input type="text" placeholder="총장" onChange={function (e) { this.size[0] = Number(e.target.value) }.bind(this)} />
                    <input type="text" placeholder="허벅지" onChange={function (e) { this.size[2] = Number(e.target.value) }.bind(this)} />
                    <input type="text" placeholder="밑위" onChange={function (e) { this.size[3] = Number(e.target.value) }.bind(this)} />


function Post() {
    useEffect(() => {
        Axios.get(apiUrl)
            .then(response => {
                console.log("loaded response :", response);
             
            })
    }, []);
    return (
        <div>
            hi
        </div>
    )
}
*/

export default Post;