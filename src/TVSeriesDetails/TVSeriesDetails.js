import { Component } from "react";
import { createRef} from "react";
import settings from "../settings";
import MovieCast from "../MovieCast/MovieCast";
import RecommendationsPanel from "../RecommendationsPanel/RecommendationsPanel";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import RatingsBar from "../RatingsBar/RatingsBar";
import TVSeasons from "../TVSeasons/TVSeasons";
import TVSeason from "../TVSeason/TVSeason";
import RelatedVideos from "../RelatedVideos/RelatedVideos";
import ImagesPanel from "../ImagesPanel/ImagesPanel";
import WatchProviders from "../WatchProviders/WatchProviders";
import fbicon from "../images/f_logo_RGB-Blue_1024.png";
import twittericon from "../images/Twitter social icons - circle - blue.png";
import ListDialog from "../ListDialog/ListDialog";
import shareIcon from "../images/share.svg";
import ShareDlg from "../ShareDlg/ShareDlg";

class TVSeriesDetails extends Component {
    constructor(props) {
        super(props);
        this.reviewsDetails = createRef(null);
        this.country = "US";
        this.selectedSeason =  null;
        this.descriptionDiv = createRef(null);
        this.castPanel = createRef(null);
        this.cast = false;

        this.state = {
            shareDlg: false,
            title: "",
            data: {},
            cast: [],
            credits: [],
            recommendations: [],
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

        url = `${settings.api_url}api/details/tvshow?itemID=${this.props.itemID}`;
        fetch(
            url
        )
        .then(
            response => response.json()
        )
        .then(data => {
            let title = "";
            let seasons = [];

            title = data.name;
            seasons = data.seasons;
            this.props.updateTitle(title);
            if(this.props.itemType === "tv" || this.props.itemType === "movie"){

                fetch(
                    `${settings.api_url}api/recommended?media_type=${this.props.itemType}&tmdb_id=${this.props.itemID}`
                )
                .then(
                    response => response.json()
                )
                .then(recommendations => {
                    document.title = `VideoPulse - ${title}`;
        
                    this.setState({
                        title: title,
                        data: data,
                        cast: cast,
                        seasons: seasons,
                        recommendations: recommendations,
                    })            
                }) 
            }   
        });
    }

    componentDidUpdate = (prevProps)=>{
        if(this.activeTab === "cast" && this.cast){
            document.addEventListener("keydown",this.castPanel?.current?.processKey,null);
            this.cast = true;
        }
        if(this.activeTab !== "cast"){
            this.cast = false;
            document.removeEventListener("keydown",this.castPanel?.current?.processKey);
        }
    }

    toggleTab = (e,tab) => {
        let selectedTab = e.target.dataset.view;

        if(this.activeTab === selectedTab){
            this.activeTab = null;
        }
        else{
            this.activeTab = selectedTab;
        }

        if(this.activeTab === "cast" && !this.cast){
            this.castPanel?.current?.focus();
            document.addEventListener("keydown",this.castPanel?.current?.processKey,null);
            this.cast = true;
        }
        if(this.activeTab !== "cast"){
            this.cast = false;
            document.removeEventListener("keydown",this.castPanel?.current?.processKey);
        }
        this.forceUpdate();
    }

    hideDescription = () => {
        this.descriptionDiv.current.classList.add('small-screen-description-hide');
    }
    showDescription = () => {
        this.descriptionDiv.current.classList.remove('small-screen-description-hide');
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

    handleWatchNow = () => {
        this.activeTab = "watchnow";
        this.forceUpdate();
    }

    backToSeasons = () => {
        this.activeTab = "seasons";
        this.forceUpdate();
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
            backgroundImage: `url(${settings.backdrop_base}${this.state.data.backdrop_path})`
        }
        let docHead = document.getElementsByTagName('head')[0];
        if(document.getElementById("ogimage") === null && typeof this.state.data.backdrop_path !== 'undefined'){
            let shareThumb = document.createElement("meta");
            shareThumb.setAttribute('property', 'og:image');
            shareThumb.setAttribute('content',`${settings.backdrop_base}${this.state.data.backdrop_path}`);
            shareThumb.setAttribute("id","ogimage");
            docHead.appendChild(shareThumb);
        }
        if(document.getElementById("ogtitle") === null && title !== ""){
            let shareTitle = document.createElement("meta");
            shareTitle.setAttribute("property","og:title");
            shareTitle.setAttribute("content","VideoPulse - " + title);
            shareTitle.setAttribute("id","ogtitle");
            docHead.appendChild(shareTitle);
        }
        if(document.getElementById("ogurl") === null){
            let shareURL = document.createElement("meta");
            shareURL.setAttribute("property","og:url");
            shareURL.setAttribute("content",window.location.href);
            shareURL.setAttribute("id","ogurl");
            docHead.appendChild(shareURL);
        }
        if(document.getElementById("ogtype") === null){
            let shareType = document.createElement("meta");
            shareType.setAttribute("property","og:type");
            shareType.setAttribute("content","website");
            shareType.setAttribute("id","ogtype");
            docHead.appendChild(shareType);
        }
        if(document.getElementById("ogdesc") === null && typeof this.state.data.overview !== 'undefined'){
            let shareThumb = document.createElement("meta");
            shareThumb.setAttribute('property', 'og:description');
            shareThumb.setAttribute('content',this.state.data.overview);
            shareThumb.setAttribute("id","ogdesc");
            docHead.appendChild(shareThumb);
        }

        let castTabClass = "tabs-tab",
            recommendationsTabClass = "tabs-tab",
            videosTabClass = "tabs-tab",
            seasonsTabClass = "tabs-tab",
            imagesTabClass = "tabs-tab",
            reviewsTabClass = "tabs-tab";

            const social_icon = {
                width: "32px",
                marginRight: "12px"
            }
            let twitter = [], facebook = [];
            if(typeof this.state.data.external_ids !== "undefined"){
                if(this.state.data.external_ids.twitter_id !== null){
                    twitter.push(<a target={"_blank"} href={`https://www.twitter.com/${this.state.data.external_ids.twitter_id}`}><img style={social_icon} src={twittericon} alt="Twitter" title={title+" on Twitter"}/></a>);
                }
                else{
                    twitter.push(<></>);
                }
                if(this.state.data.external_ids.facebook_id !== "" && this.state.data.external_ids.facebook_id !== null)
                    facebook.push(<a target={"_blank"} href={`https://www.facebook.com/${this.state.data.external_ids.facebook_id}`}><img style={social_icon} src={fbicon} alt="Facebook" title={title+" on Facebook"} /></a>);
                else
                    facebook.push(<></>);
            }
            else
                twitter.push(<></>);
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
                    poster_path={this.state.data.poster_path} 
                    media_name={this.state.data.name} 
                    closeDlg={this.closeAddToListDlg} 
                    mediaID={this.props.itemID} 
                    mediaType={this.props.itemType}/>:<></>}
                <div className="tabs-container">
                    <div ref={this.castTab} data-view="cast" className={castTabClass} onClick={this.toggleTab}>Cast &amp; Crew</div> {/**  tabs-tab-selected */}
                    <div ref={this.recommendationsTab} data-view="recommendations" className={recommendationsTabClass} onClick={this.toggleTab}>Recommendations</div>
                    <div ref={this.videosTab} data-view="videos" className={videosTabClass} onClick={this.toggleTab}>Videos</div>
                    <div ref={this.imagesTab} data-view="images" class={imagesTabClass} onClick={this.toggleTab}>Images</div>
                    <div ref={this.episodesTab} data-view="seasons" className={seasonsTabClass} onClick={this.toggleTab}>Seasons</div>
                    <div ref={this.reviewsTab} data-view="reviews" className={reviewsTabClass} onClick={this.toggleTab}>Reviews</div>
                </div>
                <div className="movie-details-container">
                    <div className="movie-details-top" style={backdropStyle}>
                        <div className="primary-container">
                            <div className="secondary-container">
                                <div className="movie-description" ref={this.descriptionDiv}>
                                    <div className="add-to-list" title="Share" onClick={this.share}><img src={shareIcon} style={{width:"22px"}} alt="Share" title="Share"/></div>
                                    <div className="add-to-list" title="Add to list" onClick={this.addToList}>+</div>
                                    <em className="movie-details-type">Series</em><br />
                                    <img className="details-poster-image" src={settings.poster_base+ this.state.data.poster_path} alt="poster" />
                                    <h2>{title}</h2>
                                    <p>{this.state.data.overview}</p><p>{twitter}{facebook}</p> 
                                    <div className="videopulse-button" onClick={this.handleWatchNow}>Watch Now <span className="darker">|</span> ˅</div><RatingsBar rating={this.state.data.vote_average*10} />
                                </div>
                                { this.activeTab === "cast"?<MovieCast ref={this.castPanel} itemType={this.props.itemType} itemID={this.props.itemID}/>:<></>}
                                { this.activeTab === "recommendations"?<RecommendationsPanel itemType={this.props.itemType} itemID={this.props.itemID}/>:<></>} 
                                { this.activeTab === "videos"?<RelatedVideos itemID={this.props.itemID} itemType={this.props.itemType} />:<></>}
                                { this.activeTab === "images"?<ImagesPanel itemID={this.props.itemID} itemType={this.props.itemType} images={this.state.data.images} />:<></>}
                                { this.activeTab === "seasons"?<TVSeasons seriesName={this.state.data.name} seasonDetails={(e,param1) => {this.seasonDetails(e,param1)}} seasons={this.state.data.seasons} itemID={this.props.itemID} itemType={this.props.itemType} />:<></>}
                                { this.activeTab === "reviews"?<ReviewsSection itemID={this.props.itemID} itemType={this.props.itemType} />:<></>}
                                { this.activeTab === "season"?<TVSeason seriesName={this.state.data.name} backToSeasons={this.backToSeasons} itemID={this.props.itemID} season={this.seasonNumber} seasonName={this.seasonName}/>:<></>}
                                { this.activeTab === 'watchnow'?<WatchProviders region={this.props.getRegionCode()} mediaID={this.props.itemID} mediaType={this.props.itemType}/>:<></>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
         )
    }
}
export default TVSeriesDetails;