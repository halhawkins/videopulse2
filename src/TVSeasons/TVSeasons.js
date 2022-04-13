import { Component } from "react";
import TVEpisodes from "../TVEpisodes/TVEpisodes";
import posterPlaceholder from "../images/poster-placeholder.jpg";

class TVSeasons extends Component{
    constructor(props){
        super(props);

        this.state = {
            showSeason: -1
        }
    }

    showEpisodes = (e) => {
        this.setState({
            showSeason:e.target.getAttribute("data-season")
        });    
        this.forceUpdate();
    }

    render = () => {
        let imageBaseURL = "https://image.tmdb.org/t/p/w500";
        const posterStyle = {
            objectFit: "contain"
        }
        // var date_format = { year: 'numeric', month: 'long', day: 'numeric' };
        return(
            <div className="tvseasons-div"><h3>Seasons</h3>{
                typeof this.props.seasons !== 'undefined'?this.props.seasons.map((season,si)=>{
                    return(
                        <div data-title={season.name} data-season={season.number} onClick={(e,si) => this.props.seasonDetails(e,si)} className="tv-season-container summary-small-size" key={`seasons-div1-${si}`}>
                        <div style={posterStyle} key={`seasons-div2-${si}`}>
                            <div style={posterStyle} key={`seasons-div3-${si}`} data-season={season.season_number} className="small-poster-div"> {/*onClick={this.showEpisodes}*/}
                                <img className="small-poster" style={posterStyle} key={`seasons-img1-${si}`} data-season={season.season_number} src={season.poster_path!==null?imageBaseURL+season.poster_path:posterPlaceholder} alt="season poster" /> {/** onClick={this.showEpisodes} */}
                            </div>
                            <div className="small-media-title" key={`seasons-div4-${si}`} data-season={season.season_number} onClick={this.showEpisodes}>
                                <div>{season.name}</div>
                            <div key={`seasons-div5-${si}`} data-season={season.season_number} >{season.overview.substr(0,40)}{season.overview.length > 40?"...":""}</div> {/*onClick={this.showEpisodes} */}
                            <div key={`seasons-div6-${si}`} data-season={season.season_number}>{season.episode_count} episodes</div>{/*onClick={this.showEpisodes} */}
                            <div key={`seasons-div7-${si}`} data-season={season.season_number}>{season.air_date!==null?`Aired on ${season.air_date}`:""}</div></div>            {/*onClick={this.showEpisodes} */}                        
                        </div>
                        </div>
                    );
                }):<></>
            }
            </div>
        )
    }
}

export default TVSeasons;