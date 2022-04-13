import axios from "axios";
import { Component } from "react";
import settings from "../settings";
import placeholderLandscape from "../images/place-holder-landscape.jpg";

class TVEpisodes extends Component{
    constructor(props){
        super(props);
        this.state = {
            season: null
        }
    }

    componentDidUpdate = (oldPros) => {
        if(oldPros.season !== this.props.season){
            axios.get(`${settings.api_url}api/details/tv/season?itemID=${this.props.itemID}&season=${this.props.season}`)
            .then(data => {
                this.setState({
                    season: data
                });
            })
            this.setState({
                season: this.props.season
            })
        }
    }

    componentDidMount = () => {
        axios.get(`${settings.api_url}api/details/tv/season?itemID=${this.props.itemID}&season=${this.props.season}`)
        .then(data => {
            this.setState({
                season: data.data
            });
        })
    }

    gotoEpisode = () => {
        
    }

    render = () => {
        let imageBaseURL = "https://image.tmdb.org/t/p/w500";
        if(this.state.season !== null)
            return (
                <div className="subsection1">
                    {
                        this.state.season.episodes.map((item,i) => {
                            return (
                                <div className="episode-row">                                    
                                    <div onClick={this.gotoEpisode} className="episode-thumb">
                                        <a href={`?page=details&seasonNumber=${item.season_number}&episodeNumber=${item.episode_number}&itemID=${this.props.itemID}&itemType=episode`} >
                                            <img src={item.still_path===null?placeholderLandscape:imageBaseURL + item.still_path} alt="poster" />
                                        </a>
                                    </div>
                                    <div onClick={this.gotoEpisode}><a href={`?page=details&seasonNumber=${item.season_number}&episodeNumber=${item.episode_number}&itemID=${this.props.itemID}&itemType=episode`} >{item.name}</a></div>
                                    <div onClick={this.gotoEpisode}>{item.overview}</div>
                                    <div onClick={this.gotoEpisode} style={{display:"none"}}>{item.vote_average}</div>
                                </div>
                            )
                        })
                    }
                </div>
            );
        else
            return <div className="subsection"></div>
    }
}

export default TVEpisodes;