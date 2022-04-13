import axios from "axios";
import { Component } from "react";
import settings from "../settings";
import backArrow from "../images/back_arrow.png";
import posterPlaceholder from "../images/poster-placeholder.jpg";

class TVSeason extends Component{
    constructor(props){
        super(props);
        this.state = {
            episodes: []
        }
    }

    componentDidMount = () => {
        const url = `${settings.api_url}api/details/tv/season?itemID=${this.props.itemID}&season=${this.props.season}`;
        axios.get(url)
        .then(data => {
            this.setState({
                episodes: data.data
            });
        });
    }

    componentDidUpdate = (oldProps) => {
        if((oldProps.itemID !== this.props.itemID) ||
            (oldProps.season !== this.props.season)){
                const url = `${settings.api_url}api/details/tv/season?itemID=${this.props.itemID}&season=${this.props.season}`;
                axios.get(url)
                .then(data => {
                    this.setState({
                        episodes: data.data
                    });
                });        
            }
    }

    render = () => {
        const backbuttonStyle = {
            width: "20px",
            height: "20px",
            display: "inline-block"
        }
        const seasonName = typeof this.props.seasonName === "undefined"?"":this.props.seasonName;
        let imageBaseURL = "https://image.tmdb.org/t/p/w500";
        const posterStyle = {
            objectFit: "contain"
        }
        if(this.state.episodes)

        return (
            <div className="tvseasons-div"><div style={{display:"flex", justifyContent: "flex-start"}}><div><img src={backArrow} alt="back arrow" style={backbuttonStyle}/></div><div style={{color: "orange", marginLeft: "1em"}}> Back to seasons</div></div><h3 style={{marginTop: "0", marginBottom: "0"}}>{this.state.episodes.name}</h3>
                {
                    typeof this.state.episodes.episodes !== "undefined"?this.state.episodes.episodes.map((item,si) => {
                        return(
                        <a href={`?page=details&itemType=episode&itemID=${this.props.itemID}&season=${this.props.season}&episode=${item.episode_number}`}>
                            <div data-episode={item.episode_number} data-season={seasonName} className="tv-episode-container summary-small-size" key={`seasons-div1-${si}`}>
                            <div style={posterStyle} key={`seasons-div2-${si}`}>
                                <div style={posterStyle} key={`seasons-div3-${si}`} data-season={item.episode_number} className="small-poster-div" >
                                    <img className="tv-episode-still" style={posterStyle} key={`seasons-img1-${si}`} data-season={item.episode_number} src={item.still_path!==null?imageBaseURL+item.still_path:posterPlaceholder} alt="season poster" />
                                </div>
                                <div className="small-media-title" key={`seasons-div4-${si}`} data-season={item.episode_number} >
                                    <div>{item.name}</div>
                                <div key={`seasons-div5-${si}`} data-episode={item.episode_number} >{item.overview.substr(0,65)}{item.overview.length > 65?"...":""}</div><br />
                                <div key={`seasons-div7-${si}`} data-episode={item.episode_number} >{item.air_date!==null?`Aired on ${item.air_date}`:""}</div></div>                                    
                            </div>
                            </div></a>
                        );
                        }):<></>
                }
            </div>
        );
    }
}
export default TVSeason;