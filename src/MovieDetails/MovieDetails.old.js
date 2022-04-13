import axios from "axios";
import { Component, createRef } from "react";
import settings from "../settings";
import PosterComponent from "../PosterComponent/PosterComponent";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import RatingsBar from "../RatingsBar/RatingsBar";
import CastComponent from "../CastComponent/CastComponent";
import RelatedVideos from "../RelatedVideos/RelatedVideos";
import sampleAd from "../images/sample-ad.png";
import MediaSummary from "../MediaSummary/MediaSummary";
import addToList from '../images/add_to_list_orange.png';

class MovieDetails extends Component{
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
        let cast = [];
        let url = `${settings.api_url}api/details/movie?itemID=${this.props.itemID}`;;
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
                fetch(
                    `https://api.themoviedb.org/3/${this.props.itemType}/${this.props.itemID}/watch/providers?api_key=${settings.tmdb_key}`
                )
                .then(
                    response => response.json()
                )
                .then( watchProviders =>{
                    this.setState({
                        title: title,
                        data: data,
                        cast: cast,
                        // seasons: seasons,
                        recommendations: recommendations.data,
                        watchProviders: watchProviders.results
                    });

                })
            // let axoptions = {
            //         url: `https://api.themoviedb.org/3/movie/${this.props.itemID}/watch/providers?api_key=${settings.tmdb_key}`,
            //         method: 'GET',
            //         params:{
            //             api_key: settings.tmdb_key
            //         },
            //         headers: {
            //             "Access-Control-Allow-Origin": "*",
            //             "Content-Type": "text/plain",
            //           },
                    
            //     }
            //     axios(axoptions)
            //     // fetch(`https://api.themoviedb.org/3/movie/${this.props.itemID}/watch/providers?api_key=${settings.tmdb_key}`)
            //     // .then(response => response.json())
            //     .then(watchProviders =>{
            //         this.setState({
            //             title: title,
            //             data: data,
            //             cast: cast,
            //             recommendations: recommendations,
            //             watchProviders: watchProviders.results
            //         })
                })
            })
        // });
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

    render = () => {
        let backdrop_path = "";
        let title = "";
        let genres = [];

        if(Object.keys(this.state.data).length > 0){
            title = this.state.data.title;
            if(typeof(this.state.data.genres) !== 'undefined'){
                genres = this.state.data.genres;
            }
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
                if(typeof(this.state.watchProviders[this.country].flatrate) !== "undefined"){
                    watchProviders = watchProviders.concat(
                        <div className="providers-section"><div><h4>Stream on:</h4></div> {watchProviders.concat(this.state.watchProviders[this.country].flatrate.map((item) => {
                        return <div className="provider-entry" ><div className="provider-logo"><img title={item.provider_name} width="32px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" /></div><div className="provider-name">{item.provider_name}</div></div>
                        }))}</div>
                        )
                    }
                if(typeof(this.state.watchProviders[this.country].rent) !== "undefined"){
                    rentProviders = rentProviders.concat(
                        <div className="providers-section"><div><h4>Rent on:</h4></div>{rentProviders.concat(this.state.watchProviders[this.country].rent.map((item) => {
                        return <div className="provider-entry" ><div className="provider-logo"><img title={item.provider_name} width="32px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" /></div><div className="provider-name">{item.provider_name}</div></div>
                    }))}</div>
                    )
                }
                if(typeof(this.state.watchProviders[this.country].buy) !== "undefined"){
                    buyOnProviders = buyOnProviders.concat(
                        <div className="providers-section"><div><h4>Buy on:</h4></div>{buyOnProviders.concat(this.state.watchProviders[this.country].buy.map((item) => {
                        return <div className="provider-entry"><div className="provider-logo"><img title={item.provider_name} width="32px" src={"https://image.tmdb.org/t/p/original" + item.logo_path} alt="provider logo" /></div><div className="provider-name">{item.provider_name}</div></div>
                    }))}</div>
                    )
                }
            }
        }
        return (
            <div style={{marginTop: "2em"}}>
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
                            <div className="details-item-title"><h2>{title} {this.isnumeric(parseInt(this.state.data.release_date,10))?`(${parseInt(this.state.data.release_date,10)})`:""}</h2><img className="add-to-list-button" src={addToList} alt="add to list" onClick={this.props.addToList} /></div><RatingsBar />
                            <div className="item-overview">{this.state.data.overview}</div>
                            <div className="details-subsection1">
                            <div className="item-type"><em>Movie</em></div>
                            <div className="watch-providers">
                                {airingOnProviders}
                                {watchProviders}
                                {rentProviders}
                                {buyOnProviders}
                            </div>
                            <div className="genres">
                                {genres.map((item,i) => {
                                    return(
                                            <div className="tag-div">{item.name}</div>
                                    );
                                })}
                            </div>
                            </div>
                            <div className="details-subsection2">
                                <CastComponent itemType={this.props.itemType} itemID={this.props.itemID} />
                            </div>
                            <div className="mobile-reviews">
                                <ReviewsSection itemID={this.props.itemID} itemType={this.props.itemType}/>
                            </div>
                            <div className="videos-section">
                                <RelatedVideos itemID={this.props.itemID} itemType={this.props.itemType} />
                            </div>
                        </div>
                        <div className="full-right-column">
                            <div>
                                <img className="fake-ad" src={sampleAd} alt="fake ad" />
                            </div>
                            <div className="recommendation-side"><h3>Recommendations:</h3>
                                {
                                    this.state.recommendations !== null?this.state.recommendations.map((item,i) => {
                                        return <MediaSummary size={"small"} key={"item"+item.id} mediaID={item.tmdb_id} mediaType={item.media_type} media_name={item.media_name} poster_path={item.poster_path} vote_average={item.vote_average}/>
                                    }):<></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default MovieDetails;