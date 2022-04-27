import { Component } from "react";
import { createRef} from "react";
import settings from "../settings";
import MovieCast from "../MovieCast/MovieCast";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import RatingsBar from "../RatingsBar/RatingsBar";
import {getParameterByName} from "../util";
import WatchProviders from "../WatchProviders/WatchProviders";
import ListDialog from "../ListDialog/ListDialog";
import shareIcon from "../images/share.svg";
import ShareDlg from "../ShareDlg/ShareDlg";

class TVEpisodeDetails extends Component {
    constructor(props) {
        super(props);
        this.reviewsDetails = createRef(null);
        this.castPanel = createRef(null);
        this.country = "US";
        this.selectedSeason =  null;
        this.activeTab = "";
        this.cast = false;
        this.state = {
            shareDlg: false,
            title: "",
            data: {},
            cast: [],
            credits: [],
            seasons: [],
            watchProviders: {
                US: {
                    flatrate:[],
                    buy:[],
                    rent:[]
                }
            }
        }
    }

    getTitle = () => {
        return this.state.title;
    }

    componentDidUpdate = () => {
        if(this.activeTab === "cast" && this.cast){
            document.addEventListener("keydown",this.castPanel?.current?.processKey,null);
            this.cast = true;
        }
        if(this.activeTab !== "cast"){
            this.cast = false;
            document.removeEventListener("keydown",this.castPanel?.current?.processKey,true);
        }
    }

    componentDidMount = () => {
        let url = "";
        let cast = [];

        url = `${settings.api_url}api/details/tv/episode?itemID=${this.props.itemID}&season=${getParameterByName("season")}&episode=${getParameterByName("episode")}`;
        fetch(
            url
        )
        .then(
            response => response.json()
        )
        .then(episodedata => {
            let title = "";
            let seasons = [];

            title = episodedata.name;

            this.props.updateTitle(title);


            this.setState({
                title: title,
                data: episodedata,
                cast: cast,
                seasons: seasons,
            })
        });
    }

    watchNow = (e) => {
        this.activeTab = "watchnow";
        this.forceUpdate();
        return;
    }

    toggleTab = (e,tab) => {
        let selectedTab = e.target.dataset.view;

        if(this.activeTab === selectedTab){
            this.activeTab = null;
        }
        else{
            this.activeTab = selectedTab;
        }
        if(this.activeTab === "cast"){
            this.cast = true;
        }
        this.forceUpdate();
        
    }

    closeDlg = () => {
        this.reviewsDetails.current.style.display = "none";
    }

    showreview = (content) => {
        this.reviewsDetails.current.style.display = "inline";
        this.reviewsDetails.current.children[1].innerHTML = content;
    }

    seasonDetails = (e,name) => {
        this.activeTab = "season";
        this.seasonNumber = e.target.dataset.season;
        this.seasonName = e.target.dataset.season_name;
        this.forceUpdate();
    }
    
    closeAddToListDlg = () => {
        this.setState({
            addToListDlg: false
        })
    }
    
    addToList = () => {
        this.setState({
            addToListDlg: true
        });
    }

    share = () => {
        this.setState({
            shareDlg: true
        });
        this.forceUpdate();
    }

    closeSharingDlg = () => {
        this.setState({
            shareDlg: false
        });
        this.forceUpdate();
    }

    render = () => {
        let title = "";

        if(Object.keys(this.state.data).length > 0){
            title = this.state.data.name;
        }
        let backdropStyle = {
            backgroundImage: `url(${settings.backdrop_base}${this.state.data.still_path})`
        }

        let castTabClass = "tabs-tab";
        return (
            /**
             * I've added json-query
             * @url https://www.npmjs.com/package/json-query
             * specifically for getting watch providers matching user settings.
             */
            <>
            {this.state.shareDlg===true?<ShareDlg close={this.closeSharingDlg}/>:<></>}
            {this.state.addToListDlg?
            <ListDialog 
                poster_path={this.state.data.still_path} 
                media_name={this.state.data.name} 
                closeDlg={this.closeAddToListDlg} 
                mediaID={this.props.itemID} 
                mediaType={this.props.itemType}
                episode={getParameterByName("episode")}
                season={getParameterByName("season")}/>:<></>}

             <div className="movie-details-container">
                 
             <div className="movie-details-top" style={backdropStyle}>
                 <div className="tabs-container">
                     <div ref={this.castTab} data-view="cast" className={castTabClass} onClick={this.toggleTab}>Cast &amp; Crew</div> {/**  tabs-tab-selected */}
                 </div>
                 <div className="movie-description">
                    <div className="add-to-list" title="Share" onClick={this.share}><img src={shareIcon} style={{width:"22px"}} alt="Share" title="Share"/></div>
                    <div className="add-to-list" title="Add to list" onClick={this.addToList}>+</div>
                     <em className="movie-details-type">Episode</em>
                     <div className="tv-episode-name"><a href={`?page=details&itemType=tv&itemID=${this.props.itemID}`} >{getParameterByName("series")}</a></div>
                     <h2>{title}</h2>
                     <p>{this.state.data.overview}</p>  
                     <div className="videopulse-button" onClick={this.watchNow}>Watch Now <span className="darker">|</span> ˅</div><RatingsBar rating={this.state.data.vote_average*10} />
                 </div>
                 { this.activeTab === "cast"?<MovieCast ref={this.castPanel} itemType={this.props.itemType} itemID={this.props.itemID} season={this.props.season} episode={this.props.episode}/>:<></>}
                 { this.activeTab === "reviews"?<ReviewsSection itemID={this.props.itemID} itemType={this.props.itemType} />:<></>}
                 { this.activeTab === "watchnow"?<WatchProviders mediaType={this.props.itemType} mediaID={this.props.itemID} season={this.props.season} episode={this.props.episode} />:<></>}
             </div>

         </div>
         </>
         )
    }
}
export default TVEpisodeDetails;