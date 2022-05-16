import { Component, createRef } from "react";
import settings from "../settings";
import axios from "axios";
import default_image from "../images/default-profile-icon-24.jpg";

class MovieCast extends Component {
    constructor(props){
        super(props);
        this.scrollPos = 0;
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

    focusPanel = () => {
        this.castPanel.current.focus();
    }

    processKey = (e) => {
        if(e.key === "ArrowRight"){
            this.scroll("r");
        }
        if(e.key === "ArrowLeft"){
            this.scroll("l");
        }
    }

    scroll = (rl) => {
        let panelWidth = this.castPanel?.current?.clientWidth;
        let scrollWidth = this.castPanel?.current?.scrollWidth;

        if(rl === 'r'){
            if(this.castPanel.current.lastChild.offsetLeft+419 > this.scrollPos+panelWidth){
                if(this.scrollPos === 0)
                    this.scrollPos = this.scrollPos += 432;
                else
                    this.scrollPos = this.scrollPos += 419;
            }
        }
        if(rl === 'l'){
            this.scrollPos = this.scrollPos-419<0?0:this.scrollPos -= 419;
        }
        this.castPanel.current.scroll({left:this.scrollPos,behavior: "smooth"});

    }

    render = () => {
        let castSection, crewSection, creatorsSection, directorsSection;

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

        return <>
        <div ref={this.castPanel} className="cast-panel">
            {creatorsSection}
            {directorsSection}
            {castSection}
            {crewSection}
        </div>
        </>
    }
}

export default MovieCast;