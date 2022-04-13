import { Component } from "react";
import settings from "../settings";
import axios from "axios";
import MediaSummary from "../MediaSummary/MediaSummary";

class RecommendationsPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            recommendations: []
        };
    }
    
    getParameterByName = (name, url = window.location.href) => {
        const params = new URLSearchParams(window.location.search);
          return params.get(name);
    }

    componentDidMount = () => {
        axios.get(`${settings.api_url}api/recommended?media_type=movie&tmdb_id=${this.props.itemID}`)
        .then(recommendations => {
            this.setState({
                recommendations: recommendations.data
            });
        })
    }

    render = () => {
        if(this.state.recommendations.length===0){
            return <div ref={this.castPanel} className="cast-panel">
                        <div className="panel-title">Recommendations</div>
                        <div className="small-media-item summary-small-size" style={{color: "white"}}>No results</div>
                    </div>
        }
        return  <div ref={this.castPanel} className="cast-panel">
                    <div className="panel-title"><h3>Recommendations</h3></div>
                        {this.state.recommendations.length>0?this.state.recommendations.map((item,i) => {
                            return (
                                    <div className="tv-season-container summary-small-size"><a href={`?page=details&itemType=${item.media_type}&itemID=${item.tmdb_id}`}>
                                        <div style={{objectFit:"contain",display: "flex"}} >
                                            <div className="small-poster-div" style={{objectFit:"contain"}}>
                                                <img className="small-poster" style={{objectFit: "contain"}} alt="" src={settings.poster_base + item.poster_path}/>
                                            </div>
                                            <div style={{display: "flex",flexDirection: "column"}}>
                                                <div style={{marginBottom:".2em"}}>{item.media_name}</div>
                                                <em className="mocvie-details-type" style={{textTransform: "capitalize", color:"orange"}}>{item.media_type === "tv"?"Series":item.media_type}</em>
                                                <div>{item.overview.length>100?item.overview.substr(0,100)+"...":item.overview}</div>
                                            </div>
                                        </div>
                                    </a></div>
                                
                                )
                                // <MediaSummary size="small"key={"item"+item.id} mediaID={item.tmdb_id} desc={item.overview} mediaType={item.media_type} media_name={item.media_name} poster_path={item.poster_path} vote_average={item.vote_average}/>
                                }):<></>}
                </div>
    }

}

export default RecommendationsPanel;