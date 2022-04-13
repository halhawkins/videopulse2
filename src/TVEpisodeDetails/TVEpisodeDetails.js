import { Component } from "react";
import { createRef} from "react";
import settings from "../settings";
import MovieCast from "../MovieCast/MovieCast";
import thinPlus from "../images/thin-orange-plus.svg";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import RatingsBar from "../RatingsBar/RatingsBar";
import TVSeasons from "../TVSeasons/TVSeasons";
import TVSeason from "../TVSeason/TVSeason";
import RelatedVideos from "../RelatedVideos/RelatedVideos";
import {getParameterByName} from "../util";
import WatchProviders from "../WatchProviders/WatchProviders";
import ListDialog from "../ListDialog/ListDialog";

class TVEpisodeDetails extends Component {
    constructor(props) {
        super(props);
        this.reviewsDetails = createRef(null);
        this.country = "US";
        this.selectedSeason =  null;
        this.state = {
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
        this.forceUpdate();
        
    }

    closeDlg = () => {
        this.reviewsDetails.current.style.display = "none";
    }

    showreview = (content) => {
        this.reviewsDetails.current.style.display = "inline";
        this.reviewsDetails.current.children[1].innerHTML = content;
    }

    // uniqueID = () => {
    //     var id = "id" + Math.random().toString(16).slice(2);
    //     return id;
    // }

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

    render = () => {
        let still_path = "";
        let title = "";
        let genres = [];
        // let creators = [];
        let seasons = [];

        if(Object.keys(this.state.data).length > 0){
            title = this.state.data.name;
            seasons = this.state.seasons;
            if(typeof(this.state.data.genres) !== 'undefined'){
                genres = this.state.data.genres;
            }
            // if(typeof(this.state.data.created_by) !== 'undefined'){
            //     creators = this.state.data.created_by;
            // }
        }
        let backdropStyle = {
            backgroundImage: `url(${settings.backdrop_base}${this.state.data.still_path})`
        }

        let castTabClass = "tabs-tab",
            videosTabClass = "tabs-tab",
            seasonsTabClass = "tabs-tab",
            reviewsTabClass = "tabs-tab";
        console.log("tvepisodedetails ",this?.state?.data);
        return (
            /**
             * I've added json-query
             * @url https://www.npmjs.com/package/json-query
             * specifically for getting watch providers matching user settings.
             */
            <>
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
                 
             {/* <div className="details-flex"> className="details-masthead"*/}
             <div className="movie-details-top" style={backdropStyle}>
                 <div className="tabs-container">
                     <div ref={this.castTab} data-view="cast" className={castTabClass} onClick={this.toggleTab}>Cast &amp; Crew</div> {/**  tabs-tab-selected */}
                     {/* <div ref={this.reviewsTab} data-view="reviews" className={reviewsTabClass} onClick={this.toggleTab}>Reviews</div> */}
                 </div>
                 <div className="movie-description">
                    <div className="add-to-list" title="Add to list" onClick={this.addToList}>+</div>
                     <em className="movie-details-type">Episode</em>
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