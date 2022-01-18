import React from "react"
import { FrownOutlined } from "@ant-design/icons"
import { Card, notification } from 'antd'
import { Grid } from "@material-ui/core";
import { textLineBreak } from "./textLineBreak";
import NavTop from "./input/NavTop"
import MainBottom from "./input/MainBottom"
import MainTop from "./input/MainTop"
import LoadingPage from "./Loading";
import NavBottom from "./input/NavBottom"
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css'
const apiUrl = "http://127.0.0.1:8000/search/"
const apiUrl2 = "http://127.0.0.1:8000/search/top/"

const { Meta } = Card


class Post extends React.Component {
    constructor(props) {
        super(props)
        // navbar 에서 search 가 이루어질때 input 값으로 키워드와 사이즈값 변경
        this.handleInput = this.handleInput.bind(this);
        
        // 메인 검색 컴포넌트에 props로 넘긴 검색 창에서 받은 사이즈 
        this.handleSize = this.handleSize.bind(this);
        // 상의 하의가 바뀔 때 마다 검색창 변경
        this.handleOption = this.handleOption.bind(this);
        this.infiniteScroll = this.infiniteScroll.bind(this);

        this.state = {
            names: [],
            listItem: [],
            ordered: [],
            responseLists: [],
            category: [],
            inputSearch : <MainBottom onSearch = {this.handleSize} onOption = {this.handleOption}/> , // 검색창
            loadingPage : "",
            userId : this.props.userId, // 로그인시에 넘어오는 유저 아이디
        }
        this.keyword = ""
        this.ordered = []
        this.size = [-1, -1, -1, -1]
        this.cloth = "하의" // 상의, 하의 선택 구분
        this.page = 1
    }
    componentDidMount() {
        console.log("hi")
        window.addEventListener('scroll' , this.infiniteScroll , true)
    }
    
    // 무한 스크롤 , 스크롤이 마지막에 다다를 때 검색 이벤트 발생
    infiniteScroll (){
        // 전체 페이지 길이 (브라우저 별 document body 와 document Element 가 다를 수 있음 가장 큰 것을 사용하는 것이 안전하다)
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
        // 내려온 길이
        let scrollTop = Math.max(document.documentElement.scrollTop , document.body.scrollTop);
        // 보고있는 페이지 길이
        let clientHeight = document.documentElement.clientHeight;

        // 마지막 스크롤에 다다를 때 (내려온 길이와 보고있는 페이지 길이가 전체길이와 같을 때)
        if(scrollTop + clientHeight  === scrollHeight) {
            // 검색이 진행 되었을 때만 검색 메소드를 다시 호출 함
            if(this.keyword){
                if(this.cloth === "상의"){
                    this.attendance2() 
                } else {
                    this.attendance()
                }
            }
        }
    } 
    
    // navbar에서 검색
    handleInput(input) {
        // 검색 결과 리스트 초기화
        this.setState({
            listItem : []
        })
        this.keyword = input.keyword;
        // size 입력받기 공백이면 -1 값 넣기
        for(let i = 0 ; i < 4 ; i++) {
            this.size[i] = input.size[i] != "" ? input.size[i] : -1;
        }
        if(this.cloth === "상의"){
            this.page = 1
            this.attendance2();
        } else {
            this.page = 1
            this.attendance();
        }
    }

    // 메인 검색 컴포넌트에서 상, 하의 옵션에 따른 검색 컴포넌트 변경  
    handleOption(type) {
       if(type === "T") {
           this.cloth = "상의"
            this.setState({
                inputSearch : <MainTop onSearch = {this.handleSize} onOption = {this.handleOption}/>
            })
        } else {
            this.cloth = "하의"
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
                // 메인 입력창 끄기
                inputSearch : "",
                // 로딩 페이지 보이기
                loadingPage : <LoadingPage></LoadingPage>
            })
            if(this.cloth === "상의"){
                this.page = 1
                this.attendance2();
            } else {
                this.setState({
                    listItem : []
                })
                this.page = 1
                this.attendance();
            }
        }
    };

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
    
    // 사이즈 필터링 검색 
    attendance = () => {
        if(this.cloth === "상의"){
            // 키워드와 사이즈 value props로 넘기기
            this.props.onSearch(<NavTop keyword = {this.keyword} size = {this.size} onInput = {this.handleInput}/>)
        } else {
            this.props.onSearch(<NavBottom keyword = {this.keyword} size = {this.size} onInput = {this.handleInput}/>)
        }

        Axios.post(apiUrl, { keyword: this.keyword, os: this.size[0], th: this.size[1], ws: this.size[2], rs: this.size[3], page : this.page})
                    .then(response => {
                        // 오차를 기준으로 오름차순 정렬된 리스트를 응답받는다.
                        this.setState({
                            responseLists: response.data,
                        })
                        // 리스트 추가
                        let imageCard = this.state.listItem
                        
                        // 검색 결과가 없을 때
                        if(this.state.responseLists.message.length === 0 )
                        {
                            // 로딩페이지 끄기
                            this.setState({
                                loadingPage : ""
                            })
                            //검색 실패 알림
                            notification.open({
                                message : "검색결과가 없습니다" ,
                                description : "검색 키워드와 상/하의 카테고리를 확인해주세요",
                                icon: <FrownOutlined style = {{ color : "#ff3333"}}/>
                            });
                        }


                        for (let i = 0; i < this.state.responseLists.message.length; i++) {
                            // 사이즈가 없어서 빈 값으로 넘어온 경우 skip
                            if(this.state.responseLists.message[i] === null) continue
                            // 서버에서 응답받은 가장 적합한 사이즈
                            const title1 = "Outseam " + parseInt(this.state.responseLists.message[i].size[0]) + " Thigh " + parseInt(this.state.responseLists.message[i].size[1]) +"\nWaist " + parseInt(this.state.responseLists.message[i].size[2]) + " Rise " + parseInt(this.state.responseLists.message[i].size[3]);
                            
                            // 이미지 카드 생성 12 칸을 3칸씩 나눕니다
                            imageCard.push(<Grid item xs = {12} sm={3} ><Card 
                                hoverable 
                                style ={{width : 220 , margin : "auto"}} // grid의 자식 card 를 margin auto로 가운데 정렬
                                cover = {<a href={this.state.responseLists.message[i].link}><img src ={this.state.responseLists.message[i].image}/></a> }
                                >   
                                    {/* textLineBreak 는 개행문자 삽입 함수 */}
                                    <Meta title={textLineBreak(title1)} description= {Number(this.state.responseLists.message[i].price).toLocaleString() + "￦"} />
                                </Card></Grid> )
                        }
                        imageCard.push(<div ref = {this.ref} />)
                        this.setState({
                            listItem: imageCard,
                        })
                    })
             this.page += 1
    }

    // 사이즈 필터링 검색 
    attendance2 = () => {
        if(this.cloth === "상의"){
            // 키워드와 사이즈 value props로 넘기기
            this.props.onSearch(<NavTop keyword = {this.keyword} size = {this.size} onInput = {this.handleInput}/>)
        } else {
            this.props.onSearch(<NavBottom keyword = {this.keyword} size = {this.size} onInput = {this.handleInput}/>)
        }

        Axios.post(apiUrl2, { keyword: this.keyword, os: this.size[0], sh: this.size[1], ch: this.size[2], ar: this.size[3], page : this.page })
                    .then(response => {
                        // 오차를 기준으로 오름차순 정렬된 리스트를 응답받는다.
                    this.setState({
                        responseLists: response.data,
                    })
                    // 리스트 추가
                    let imageCard = this.state.listItem
                    
                    // 검색 결과가 없을 때
                    if(this.state.responseLists.message.length === 0 )
                    {
                        // 로딩페이지 끄기
                        this.setState({
                            loadingPage : ""
                        })
                        //검색 실패 알림
                        notification.open({
                            message : "검색결과가 없습니다" ,
                            description : "검색 키워드와 상/하의 카테고리를 확인해주세요",
                            icon: <FrownOutlined style = {{ color : "#ff3333"}}/>
                        });
                    }


                    for (let i = 0; i < this.state.responseLists.message.length; i++) {
                        // 사이즈가 없어서 빈 값으로 넘어온 경우 skip
                        if(this.state.responseLists.message[i] === null) continue
                        // 서버에서 응답받은 가장 적합한 사이즈
                        const title1 = "Back " + parseInt(this.state.responseLists.message[i].size[0]) + " Shoulder " + parseInt(this.state.responseLists.message[i].size[1]) +"\nChest " + parseInt(this.state.responseLists.message[i].size[2]) + " Sleeve " + parseInt(this.state.responseLists.message[i].size[3]);
                        
                        // 이미지 카드 생성 12 칸을 3칸씩 나눕니다
                        imageCard.push(<Grid item xs = {12} sm={3} ><Card 
                            hoverable 
                            style ={{width : 220 , margin : "auto"}} // grid의 자식 card 를 margin auto로 가운데 정렬
                            cover = {<a href={this.state.responseLists.message[i].link}><img src ={this.state.responseLists.message[i].image}/></a> }
                            >   
                                {/* textLineBreak 는 개행문자 삽입 함수 */}
                                <Meta title={textLineBreak(title1)} description= {Number(this.state.responseLists.message[i].price).toLocaleString() + "￦"} />
                            </Card></Grid> )
                    }
                    imageCard.push(<div ref = {this.ref} />)
                    this.setState({
                        listItem: imageCard,
                    })
                })
            this.page += 1
    }

    render = () => {
        return (
            <div>
                <div class="parent"  >
                    {/* 입력창 , 검색 후에는 navbar로 올린다 */}
                    {this.state.inputSearch} 
                    <div class="parent2" >
                        <Grid container spacing = {1} >
                            {this.state.listItem}  
                        </Grid>
                    </div>
                    {/* 로딩페이지 */}
                    {this.state.loadingPage}    
                </div>
            </div>
        );
    }
}


export default Post;