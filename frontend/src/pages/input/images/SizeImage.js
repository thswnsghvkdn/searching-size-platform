import { React, useState ,useEffect} from "react"


function SizeImage (props) {

    return (
        <div style = {{ position : "relative" , top : '0%'   , display : "inline-block",  width : "600px" , height : "700px"   , backgroundRepeat : 'no-repeat',  backgroundImage : props.imageUrl ,backgroundSize : "contain"   }}>
            <p style = {{position : "relative" , top : '36%' , left : '14.6%'  , fontFamily : "Fantasy, 궁서 , NanumGothic , Dotum", fontWeight : "" , color : "black", fontSize :"28px" , height : "30px" , width : "80px" , textAlign : "center"}}>{props.title}</p>
        </div>
    );

}



export default SizeImage;