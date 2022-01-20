import { React, useState ,useEffect} from "react"




function SizeImage (props) {

    return (
        <div style = {{  verticalAlign : "top" , position : "relative" , top : '0%'   , display : "inline-block",  width : "600px" , height : "700px"   , backgroundRepeat : 'no-repeat',  backgroundImage : props.imageUrl ,backgroundSize : "cover"  }}>
        </div>
    );

}



export default SizeImage;