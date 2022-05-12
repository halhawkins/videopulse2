import { Component } from "react";
import settings from "../settings";
import vpLogo from "../images/videopulse-outline-lg.png";

class HeroComponent extends Component{
    render = () => {
        let greeting = "";
        if(this.props.pagetype === "trending"){
            greeting = "Trending today";
        }
        else if(this.props.pagetype === "populartv"){
            greeting = "Popular shows today";
        }
        else if(this.props.pagetype === "popularmovies"){
            greeting = "Popular movies today";
        }
        // const heroStyle = {
        //     backgroundImage: `url(${settings.backdrop_base}${this.props?.backdrop})`
        // }
        return(  
            <a href={`?page=details&itemID=${this.props.mediaID}&itemType=${this.props.mediaType}`}>
            <div className="hero" style={{backgroundImage: `url(${settings.backdrop_base}${this.props.backdrop})`, backgroundSize: "cover"}}>
                 <img className="hero-logo" src={vpLogo} />
                 <div className="hero-title">{greeting}<br/><h4>{this.props?.title}</h4> ...plus many others</div>
             </div>
             </a>
        );

    }
}
export default HeroComponent;