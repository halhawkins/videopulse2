import { Component } from "react";
import { createRef} from "react";
import settings from "../settings";
import CastComponent from "../CastComponent/CastComponent";
import PosterComponent from "../PosterComponent/PosterComponent";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import RatingsBar from "../RatingsBar/RatingsBar";
import TVSeasons from "../TVSeasons/TVSeasons";
import RelatedVideos from "../RelatedVideos/RelatedVideos";
import MediaSummary from "../MediaSummary/MediaSummary";
import sampleAd from "../images/sample-ad.png";
import addToList from "../images/add_to_list_orange.png";

class TVSeriesDetails extends Component {
    constructor(props) {
        super(props);
        this.reviewsDetails = createRef(null);
        this.country = "US"

        this.state = {
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

            fetch(
                `${settings.api_url}api/recommended?media_type=${this.props.itemType}&tmdb_id=${this.props.itemID}`
            )
            .then(
                response => response.json()
            )
            .then(recommendations => {
                fetch(
                    `https://api.themoviedb.org/3/${this.props.itemType}/${this.props.itemID}/watch/providers?api_key=${settings.tmdb_key}`
                )
                .then(
                    response => response.json()
                )
                .then( watchProviders =>{
                    document.title = `VideoPulse - ${title}`;
        
                    this.setState({
                        title: title,
                        data: data,
                        cast: cast,
                        seasons: seasons,
                        recommendations: recommendations,
                        watchProviders: watchProviders.results
                    })

                })
            })    
        });
    }

    closeDlg = () => {
        this.reviewsDetails.current.style.display = "none";
    }

    showreview = (content) => {
        this.reviewsDetails.current.style.display = "inline";
        this.reviewsDetails.current.children[1].innerHTML = content;
    }

    uniqueID = () => {
        var id = "id" + Math.random().toString(16).slice(2);
        return id;
    }

    render = () => {
        let backdrop_path = "";
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
            backgroundImage: backdrop_path
        }
        let watchProviders = [],
            airingOnProviders = [],
            buyOnProviders = [],
            rentProviders = []
        if(this.state.watchProviders.length === 0){
            watchProviders[0] = <div></div>
        }
        else{
            if(typeof(this.state.watchProviders[this.country]) !== "undefined"){
                if(this.props.itemType === 'tv'){
                    if(typeof(this.state.data.networks) !== "undefined"){
                        airingOnProviders = airingOnProviders.concat(
                            <div key={`aoprov-div-1`} className="providers-section">
                                <div key={`aoprov-div-2`}>
                                    <h4 key={`aoprov-h4-1`}>Airing on:</h4>
                                </div>  
                                {airingOnProviders.concat(this.state.data.networks.map((item,i) => {
                                return (
                                    <div key={"networks-div-1-"+i} className="provider-entry" >
                                        <div key={`networks-div-2-${i}`} className="provider-logo">
                                            <img key={`networks-img-1-${i}`} title={item.name} height="24px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" />
                                        </div>
                                        <div key={`networks-div-3-${i}`} className="provider-name">
                                            {item.name}
                                        </div>
                                    </div>
                                )
                            }))}</div>
                        );
                    }
                }
                if(typeof(this.state.watchProviders[this.country].flatrate) !== "undefined"){
                    watchProviders = watchProviders.concat(
                        <div className="providers-section"><div><h4>Stream on:</h4></div> {watchProviders.concat(this.state.watchProviders[this.country].flatrate.map((item,i) => {
                        return (
                            <div key={"flatrate-div1-"+i} className="provider-entry" >
                                <div key={"flatrate-div2-"+i} className="provider-logo">
                                    <img key={"flatrate-img1-"+i} title={item.provider_name} width="32px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" />
                                </div>
                                <div key={"flatrate-div3-"+i} className="provider-name">
                                    {item.provider_name}
                                </div>
                            </div>
                        )
                        }))}</div>
                        )
                    }
                if(typeof(this.state.watchProviders[this.country].rent) !== "undefined"){
                    rentProviders = rentProviders.concat(
                        <div className="providers-section"><div><h4>Rent on:</h4></div>{rentProviders.concat(this.state.watchProviders[this.country].rent.map((item,i) => {
                        return (
                            <div key={"rent-div1-"+i} className="provider-entry" >
                                <div key={"rent-div2-"+i} className="provider-logo">
                                    <img key={"rent-img1-"+i} title={item.provider_name} width="32px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" />
                                </div>
                                <div key={"rent-div3-"+i} className="provider-name">
                                    {item.provider_name}
                                </div>
                            </div>
                        )
                    }))}</div>
                    )
                }
                if(typeof(this.state.watchProviders[this.country].buy) !== "undefined"){
                    buyOnProviders = buyOnProviders.concat(
                        <div className="providers-section"><div><h4>Buy on:</h4></div>{buyOnProviders.concat(this.state.watchProviders[this.country].buy.map((item,i) => {
                        return (
                            <div key={"buy-div1-"+i} className="provider-entry">
                                <div key={"buy-div2-"+i} className="provider-logo">
                                    <img key={"buy-img1-"+i} title={item.provider_name} width="32px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" />
                                </div>
                                <div key={"buy-div3-"+i} className="provider-name">
                                    {item.provider_name}
                                </div>
                            </div>
                        )
                    }))}</div>
                    )
                }
            }
        }

        return (
                <div>
                    <div ref={this.reviewsDetails} className="details-modal"><div className="close-dlg" onClick={this.closeDlg}></div><div className="dlg-content"></div></div>
                    <div className="details-background" style={backdropStyle}>
                        <div className="details">
                                <div className="details-left-column">
                                <PosterComponent itemID={this.props.itemID} itemType={this.props.itemType} />
                                    <div className="expanded-reviews">
                                        <ReviewsSection callback={(content) => this.showreview(content)} itemID={this.props.itemID} itemType={this.props.itemType}/>
                                    </div>
                                </div>
                                <div className="details-section1" >
                                        <div className="details-item-title"><h2>{title} ({parseInt(this.state.data.first_air_date,10)})</h2>{this.props.isloggedin()?<img src={addToList} alt="add to list"  className="add-to-list-button" onClick={this.props.addToList}/>:<></>}</div><RatingsBar />
                                        <div className="item-overview">{this.state.data.overview}</div>
                                        <div className="details-subsection1">
                                        <div className="item-type"><em>TV Series</em></div>
                                        <div className="watch-providers">
                                        {airingOnProviders}
                                        </div>
                                        <div className="watch-providers">
                                        {watchProviders}
                                        </div>
                                        <div className="watch-providers">
                                        {rentProviders}
                                        </div>
                                        <div className="watch-providers">
                                        {buyOnProviders}
                                        </div>
                                        <div className="genres">
                                            {genres.map((item,i) => {
                                                return(
                                                    <div key={`tvseriestag-item${i}`} className="tag-div">{item.name}</div>
                                                );
                                            })}
                                        </div>
                                        </div>
                                        <div className="details-subsection2">
                                            <CastComponent itemType={this.props.itemType} itemID={this.props.itemID} />
                                        </div>
                                        <TVSeasons itemID={this.props.itemID} seasons={seasons}/>
                                        <div className="mobile-reviews"><ReviewsSection itemID={this.props.itemID} itemType={this.props.itemType}/></div>
                                        <div className="videos-section">
                                            <RelatedVideos itemID={this.props.itemID} itemType={this.props.itemType} />
                                        </div>
                                        <div className="recommendation-section"><h3>Recommendations:</h3>
                                            {
                                                this.state.recommendations.map((item,i) => {
                                                    return <MediaSummary key={this.uniqueID()} size={"small"} mediaID={item.tmdb_id} mediaType={item.media_type} media_name={item.media_name} poster_path={item.poster_path} vote_average={item.vote_average}/>
                                                })
                                            }
                                        </div>

                                    </div>
                                    <div className="full-right-column">
                                        <div>
                                            <img className="fake-ad" src={sampleAd} alt="fake ad" />
                                        </div>
                                            <div className="recommendation-side"><h3>Recommendations:</h3>
                                            {
                                                this.state.recommendations.map((item,i) => {
                                                    return <MediaSummary key={this.uniqueID()} size={"small"} mediaID={item.tmdb_id} mediaType={item.media_type} media_name={item.media_name} poster_path={item.poster_path} vote_average={item.vote_average}/>
                                                })
                                            }
                                            </div>
                                    </div>
                                </div>
                        </div>
                    </div>
            )
    }
}
export default TVSeriesDetails;