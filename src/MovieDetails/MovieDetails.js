import axios from "axios";
import { Component, createRef } from "react";
import settings from "../settings";
import MovieCast from "../MovieCast/MovieCast";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import RatingsBar from "../RatingsBar/RatingsBar";
import RelatedVideos from "../RelatedVideos/RelatedVideos";
import RecommendationsPanel from "../RecommendationsPanel/RecommendationsPanel";
import fbicon from "../images/f_logo_RGB-Blue_1024.png";
import twittericon from "../images/Twitter social icons - circle - blue.png";
import ImagesPanel from "../ImagesPanel/ImagesPanel";
import WatchProviders from "../WatchProviders/WatchProviders";
import ListDialog from "../ListDialog/ListDialog";

class MovieDetails extends Component{
    constructor(props) {
        super(props);
        this.reviewsDetails = createRef(null);
        this.country = "US"
        this.castPanel = createRef(null);
        this.activeTab = null;
        this.castTab = createRef(null);
        this.watchProviderIDs = [];

        this.state = {
            panel: "none",
            images: [],
            title: "",
            data: {},
            cast: [],
            credits: [],
            recommendations: [],
            addToListDlg: false,
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
        if(this.activeTab === "cast" && !this.cast){
            document.addEventListener("keydown",this.castPanel?.current?.processKey,null);
            this.cast = true;
        }
        if(this.activeTab !== "cast"){
            this.cast = false;
            document.removeEventListener("keydown",this.castPanel?.current?.processKey,true);
        }
    }

    componentDidMount = () => {
        let cast = [];
        let url = `${settings.api_url}api/details/movie?itemID=${this.props.itemID}`;

        fetch(
            url
        )
        .then(
            response => response.json()
        )
        .then(data => {
            let title = data.title;

            this.props.updateTitle(title);

            axios.get(`${settings.api_url}api/recommended?media_type=movie&tmdb_id=${this.props.itemID}`)
            .then(recommendations => {
                this.setState({
                        title: title,
                        data: data,
                        cast: cast,
                        recommendations: recommendations.data,
                    });
                })
            })
    }

    addToList = () => {
        this.setState({
            addToListDlg: true
        });
    }

    
    closeDlg = () => {
        this.reviewsDetails.current.style.display = "none";
    }

    showreview = (content) => {
        this.reviewsDetails.current.style.display = "inline";
        this.reviewsDetails.current.children[1].innerHTML = content;
    }

    isnumeric = n => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    getRegion = () => {
        return this.props.getRegion();
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
    
    closeAddToListDlg = () => {
        this.setState({
            addToListDlg: false
        })
    }

    handleWatchNow = () => {
        this.activeTab = "watchnow";
        this.forceUpdate();
    }

    render = () => {
        let backdrop_path,overview, duration;
        if(typeof this.state.data.backdrop_path !== undefined){
             backdrop_path = `https://image.tmdb.org/t/p/original${this.state.data.backdrop_path}`;
        }
        else
            backdrop_path = "";
        if(typeof this.state.data.overview !== undefined){
            overview = this.state.data.overview;
        }
        if(typeof this.state.data.runtime !== "undefined"){
            duration = Math.floor(this.state.data.runtime/60)>0?(Math.floor(this.state.data.runtime/60).toString()+"h "+(this.state.data.runtime%60).toString() + "m"):(this.state.data.runtime%60).toString() + "m";
        }

        let castTabClass = "tabs-tab",
            recommendationsTabClass = "tabs-tab",
            videosTabClass = "tabs-tab",
            reviewsTabClass = "tabs-tab",
            imagesTabClass = "tabs-tab";

        if(this.activeTab !== null){
            switch(this.activeTab){
                case "cast":
                    castTabClass = "tabs-tab tabs-tab-selected";
                    break;
                case "recommendations":
                    recommendationsTabClass = "tabs-tab tabs-tab-selected";
                    break;
                case "videos":
                    videosTabClass = "tabs-tab tabs-tab-selected";
                    break;
                case "images":
                    imagesTabClass = "tabs-tab tabs-tab-selected";
                    break;
                case "reviews":
                    reviewsTabClass = "tabs-tab tabs-tab-selected";
                    break;
                default:
                    break;
            }
        }

        let title = "";

        if(Object.keys(this.state.data).length > 0){
            title = <span>{this.state.data.title}<br />({this.state.data.release_date.toString().substring(0,4)})</span>
        }
        let backdropStyle = {
            backgroundImage: `url(${backdrop_path})`,
        }

        const social_icon = {
            width: "32px",
            marginRight: "12px"
        }
        let twitter = [], facebook = [];
        if(typeof this.state.data.external_ids !== "undefined"){
            if(this.state.data.external_ids.twitter !== "" && this.state.data.external_ids.twitter !== null)
                twitter.push(<a target={"_blank"} href={`https://www.twitter.com/${this.state.data.external_ids.twitter_id}`}><img style={social_icon} src={twittericon} alt="Twitter" title={title+" on Twitter"}/></a>);
            else
                twitter.push(<></>);

            if(this.state.data.external_ids.facebook !== "" && this.state.data.external_ids.facebook !== null)
                facebook.push(<a target={"_blank"} href={`https://www.facebook.com/${this.state.data.external_ids.facebook_id}`}><img style={social_icon} src={fbicon} alt="Facebook" title={title+" on Facebook"} /></a>);
            else
                facebook.push(<></>);
        }
        else
            twitter = "";


        return (
            /**
             * I've added json-query
             * @url https://www.npmjs.com/package/json-query
             * specifically for getting watch providers matching user settings.
             */
            <>
            {this.state.addToListDlg?
                <ListDialog 
                    lists={this.props.lists}
                    poster_path={this.state.data.poster_path} 
                    media_name={this.state.data.title} 
                    closeDlg={this.closeAddToListDlg} 
                    mediaID={this.props.itemID} 
                    mediaType={this.props.itemType}/>:<></>}
                <div class="tabs-container">
                    <div ref={this.castTab} data-view="cast" class={castTabClass} onClick={this.toggleTab}>Cast &amp; Crew</div> {/**  tabs-tab-selected */}
                    <div ref={this.recommendationsTab} data-view="recommendations" class={recommendationsTabClass} onClick={this.toggleTab}>Recommendations</div>
                    <div ref={this.videosTab} data-view="videos" class={videosTabClass} onClick={this.toggleTab}>Videos</div>
                    <div ref={this.imagesTab} data-view="images" class={imagesTabClass} onClick={this.toggleTab}>Images</div>
                    <div ref={this.reviewsTab} data-view="reviews" class={reviewsTabClass} onClick={this.toggleTab}>Reviews</div>
                </div>
                <div className="movie-details-container">
                    <div className="movie-details-top" style={backdropStyle}>
                        <div className="primary-container">
                            <div className="secondary-container">
                                <div class="movie-description">
                                    <div className="add-to-list" title="Add to list" onClick={this.addToList}>+</div>
                                    <em class="movie-details-type">Movie</em><br/>
                                    <img className="details-poster-image" src={settings.poster_base+ this.state.data.poster_path} alt="poster" />
                                    <h2>{title}</h2>
                                    <span class="duration">Duration: {duration}</span>
                                    <p>{overview}</p><p>{twitter}{facebook}  </p>
                                    <div class="videopulse-button" onClick={this.handleWatchNow}>Watch Now</div><RatingsBar rating={this.state.data.vote_average*10} />
                                </div>
                                { this.activeTab === "cast"?<MovieCast ref={this.castPanel} itemType={this.props.itemType} itemID={this.props.itemID}/>:<></>}
                                { this.activeTab === "recommendations"?<RecommendationsPanel itemType={this.props.itemType} itemID={this.props.itemID}/>:<></>} 
                                { this.activeTab === "videos"?<RelatedVideos itemID={this.props.itemID} itemType={this.props.itemType} />:<></>}
                                { this.activeTab === "images"?<ImagesPanel itemID={this.props.itemID} itemType={this.props.itemType} images={this.state.data.images} />:<></>}
                                { this.activeTab === "reviews"?<ReviewsSection itemID={this.props.itemID} itemType={this.props.itemType} />:<></>}
                                { this.activeTab === 'watchnow'?<WatchProviders region={this.props.getRegionCode()} mediaID={this.props.itemID} mediaType={this.props.itemType}/>:<></>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default MovieDetails;