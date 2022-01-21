import { React} from "react"
import "./human.css"



function HumanImage (props) {

    return (
        <div className="human" style = {{  position : "relative" , top : '0%' , left : '20%' , display : "inline-block" , width : "300px" , height : "750px" ,  backgroundRepeat : 'no-repeat', backgroundImage : props.humanUrl  , backgroundSize : "100% 100%" }}>
            <p style = {{ display : 'inline-block', position : "relative" , top : '2%' , left : '10%'  , fontFamily : "Fantasy, 궁서 , NanumGothic , Dotum", fontWeight : "" , color : "black", fontSize :"28px" , height : "30px" , width : "80px" , textAlign : "center"}}>{props.humanHeight}cm</p>
            <p style = {{display : 'inline-block' , position : "relative" , top : '2%' , left : '40%'  , fontFamily : "Fantasy, 궁서 , NanumGothic , Dotum", fontWeight : "" , color : "black", fontSize :"28px" , height : "30px" , width : "80px" , textAlign : "center"}}>{props.humanWeight}kg</p>
            <p style = {{position : "relative" , top : '80%' , left : '0%'  , fontFamily : "Fantasy, NanumGothic , Dotum", fontWeight : "" , color : "black", fontSize :"18px" , height : "30px" , width : "100%" , textAlign : "center"}}>고객님과 같은 키, 몸무게의 다른 유저들이 검색한 치수{props.humanSize}</p>
        </div>
    );

}



export default HumanImage;