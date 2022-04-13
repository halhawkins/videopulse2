import { Component, createRef } from "react";
import settings from "../settings";
import axios from "axios";
import default_image from "../images/default-profile-icon-24.jpg";

class MovieCast extends Component {
    constructor(props){
        super(props);
        this.castPanel = createRef(null);
    }
    
    componentDidMount = () => {
        let url = "";
        if(this.props.itemType === 'episode'){
            url = `${settings.api_url}api/castandcrew/${this.props.itemType}/${this.props.itemID}/${this.props.season}/${this.props.episode}`;
        }
        else{
            url = `${settings.api_url}api/castandcrew/${this.props.itemType}/${this.props.itemID}`;
        }
        axios.get(
            url
        )
        .then(data => {
            this.setState({
                creators: data.data.creators,
                directors: data.data.directors,
                cast: data.data.cast,
                crew: data.data.crew
            })
        })
    }

    hide = () => {
        this.castPanel.current.style.display = "hide";
    }

    show = () => {
        this.castPanel.current.style.display = "flex";
    }

    render = () => {
        let castSection, crewSection, creatorsSection, directorsSection;
        // let moreCast = false;
        // let moreCrew = false;
        if(this.state?.creators?.length > 0){
            creatorsSection = this.state.creators.map((item,i) => {
                return (
                
                    <div class="cast-crew-item">
                        <div>
                            <a href={`?page=details&itemID=${item.id}&itemType=person`}>
                                <img src={item.profile_path===null?default_image:"https://image.tmdb.org/t/p/w500" + item.profile_path} alt="cast" />
                            </a>
                        </div>
                        <div>
                        <a href={`?page=details&itemID=${item.id}&itemType=person`}>
                            <div class="cast-crew-item-details">
                                <p>{item.name}</p>
                                <em>{item.job}</em>
                            </div>
                        </a>
                        </div>
                    </div>
                
                )
            })
        }
        if(this?.state?.directors?.length > 0){
            directorsSection = this.state.directors.map((item,i) => {
                return (
                    <div class="cast-crew-item">
                        <div>
                            <a href={`?page=details&itemID=${item.id}&itemType=person`}>
                                <img src={item.profile_path===null?default_image:"https://image.tmdb.org/t/p/w500" + item.profile_path} alt="cast" />
                            </a>
                        </div>
                        <div class="cast-crew-item-details">
                            <a href={`?page=details&itemID=${item.id}&itemType=person`}>
                                <p>{item.name}</p>
                                <em>{item.job}</em>
                            </a>
                        </div>
                    </div>

                );
            });
        }
        if(this?.state?.cast?.length > 0){
            castSection = this.state.cast.map((item,i) => {
                if(this.state.showAll === false && i > 19){
                    // moreCast = true;
                    return <></>;
                }
                return (
                    <div class="cast-crew-item">
                        <div>
                            <a href={`?page=details&itemID=${item.id}&itemType=person`}>
                                <img src={item.profile_path===null?default_image:"https://image.tmdb.org/t/p/w500" + item.profile_path} alt="cast" />
                            </a>
                        </div>
                            <div class="cast-crew-item-details">
                                <a href={`?page=details&itemID=${item.id}&itemType=person`}>
                                    <p>{item.name}</p>
                                    <em>{item.character}</em>
                                </a>
                            </div>
                        </div>
                );
            });
        }

        if(this?.state?.crew?.length > 0){
            crewSection = this.state.crew.map((crewitem,i) => {
                if(this.state.showAll === false && i > 19){
                    // moreCrew = true;
                    return <></>;
                }
                return (
                    <div class="cast-crew-item">
                        <div>
                            <a href={`?page=details&itemID=${crewitem.id}&itemType=person`}>
                                <img src={crewitem.profile_path===null?default_image:"https://image.tmdb.org/t/p/w500" + crewitem.profile_path} alt="cast" />
                            </a>
                        </div>
                        <div class="cast-crew-item-details">
                            <a href={`?page=details&itemID=${crewitem.id}&itemType=person`}>
                                <p>{crewitem.name}</p>
                                <em>{crewitem.job}</em>
                            </a>
                        </div>
                    </div>
                );
            });
        }

        return <div ref={this.castPanel} className="cast-panel">
            {creatorsSection}
            {directorsSection}
            {castSection}
            {crewSection}
        </div>
    }
}

export default MovieCast;