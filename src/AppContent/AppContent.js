import { Component, createRef } from "react";
import MovieDetails from "../MovieDetails/MovieDetails";
import PasswordLandingPage from "../PasswordLandingPage/PasswordLandingPage";
import PersonDetails from "../PersonDetails/PersonDetaills";
import Profile from "../Profile/Profile";
import RequestPwdReset from "../RequestPwdReset/RequestPwdReset";
import SearchResults from "../SearchResults/SearchResults";
import TrendingMedia from "../TrendingMedia/TrandingMedia";
import TVEpisodeDetails from "../TVEpisodeDetails/TVEpisodeDetails";
import TVSeriesDetails from "../TVSeriesDetails/TVSeriesDetails";
import LoginPage from "../LoginPage/LoginPage";
import TopRatedTV from "../TopRatedTV/TopRatedTV";
import PopularTV from "../PopularTV/PopularTV";
import PopularMovies from "../PopularMovies/PopularMovies";
import DiscoverComponent from "../DiscoverComponent/DiscoverComponent";
import DiscoverResults from "../DiscoverResults/DiscoverResults";
import axios from "axios";
import settings from "../settings";
import apiClient from "../api";
import ListDetails from "../ListDetails/ListDetails";
import Cookies from 'js-cookie';
import {getParameterByName} from "../util";
import ListsComponent from "../ListsComponent/ListsComponent";
import FavoritesDetails from "../FavoritesDetails/FavoritesDetails";
import RegisterUser from "../RegisterUser/RegisterUser";
import VerifyAccount from "../VerifyAccount/VerifyAccount";

class AppContent extends Component{
    constructor(props){
        super(props);
        this.title = "";
        this.mediaDetailsRef = createRef(null);
        this.url = "";
        this.username = "";
        this.email = "";
        this.token = "";
        this.region_code = "US";
        this.list_id = getParameterByName("list_id");
        this.q = getParameterByName("q");
        this.profileRef = createRef(null);
        this.watchProviders = [];
        this.state = {
            page: props.contentScreen,
            lists: [],
            p: parseInt(this.getParameterByName("p"),10)?this.getParameterByName("p"):1
        }
    }

    componentDidUpdate = (prevProps) => {

        if(prevProps.contentScreen !== this.props.contentScreen){

            /* brought over from profile... */

            apiClient.get('api/profile')
            .then(response => {
                if(typeof(response.data.settings.settings.region_code) === "undefined"){
                    axios.get(`${settings.api_url}api/user/location`)
                    .then(res => {
                        this.region_code = "US";
                    })
                }
                else{
                    this.username = response.data.user.name;
                    this.email = response.data.user.email;
                    this.region_code = response.data.settings.settings.region_code;
                }
            })
            
            let p = 1;
                p = this.getParameterByName("p");
            if(this.props.page === "details"){
                this.title = this.mediaDetailsRef.current.getTitle();
            }
            this.setState({
                page: this.props.contentScreen,
                p: p
            })
        }
     }

    getRegionCode = () => {
        return this.region_code;
    }

    componentDidMount = () => {
        let p = 1;
        if( this.getParameterByName("p") === null){
            p = 1;
        }
        else{
            p = this.getParameterByName("p");
        }
        if(this.props.page === "details"){
            this.title = this.mediaDetailsRef.current.getTitle();
        }

        this.email = getParameterByName('email');
        this.token = getParameterByName('token');

        apiClient.get('api/profile')
        .then(response => {
            this.watchProviders = response.data.settings.settings.watch_providers;
            if(typeof(response.data.settings.settings.region_code) === "undefined"){
                axios.get(`${settings.api_url}api/user/location`)
                .then(res => {
                    this.region_code = "US";
                })
            }
            else{
                this.username = response.data.user.name;
                this.email = response.data.user.email;
                this.region_code = response.data.settings.settings.region_code;
                apiClient.get(`${settings.api_url}api/lists`) 
                .then(res => {
                    this.setState({
                        lists: res.data
                    })
                })
            }
        })

        this.episodeSeason = this.getParameterByName("season");
        this.episode = this.getParameterByName("episode");

        this.setState({
            page: this.props.contentScreen,
            p: p
        })
    }

    getTitle = () => {
        return this.title;
    }

    getParameterByName = (name, url = window.location.href) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    updateLists = () => {
        apiClient.get(`${settings.api_url}api/lists`) 
        .then(res => {
            this.setState({
                lists: res.data
            })
        });
    }
    
    getUrl = (itemID,itemType,q = null,p = null) => {
        this.p = this.getParameterByName('p');
        q = this.getParameterByName('q');
        p= p === null?"1":p;
        const baseURL = window.location;
        let url = "";
        let contentScreen = this.getParameterByName("page");
        if(contentScreen === null){
            contentScreen = "trending";
        }
        switch(contentScreen){
            case "profile":
                url = baseURL + "?page=profile";
                break;
            case "search":
                url = baseURL + `?page=search&q=${q}&p=${this.p}`;
                break;
            case "details":
                url = baseURL + `?page=details&itemID=${itemID}&itemType=${itemType}`;
                this.episodeSeason = this.getParameterByName("season");
                this.episode = this.getParameterByName("episode");
                this.list_id = this.getParameterByName("list_id");

                break;
            case "discover_results":
                let with_cast = this.getParameterByName('with_cast').length===0?"&with_cast=":`&with_cast=${this.getParameterByName('with_cast')}`;
                let with_genres = this.getParameterByName("with_genres").length===0?"&with_genres=":`&with_genres=${this.getParameterByName("with_genres")}`;
                let with_keywords = this.getParameterByName("with_keywords").length===0?"&with_keywords=":`&with_keywords=${this.getParameterByName("with_keywords")}`;
                let with_people = this.getParameterByName("with_people").length===0?"&with_people=":`&with_people=${this.getParameterByName("with_people")}`;
                let with_watch_providers = this.getParameterByName("with_watch_providers").length===0?"&with_watch_providers=":`&with_watch_providers=${this.getParameterByName("with_watch_providers")}`;
        
                let without_cast = this.getParameterByName('without_cast').length===0?"&without_cast=":`&without_cast=${this.getParameterByName('without_cast')}`;
                let without_genres = this.getParameterByName("without_genres").length===0?"`&without_genres=":`&without_genres=${this.getParameterByName("without_genres")}`;
                let without_keywords = this.getParameterByName("without_keywords").length===0?"&without_keywords=":`&without_keywords=${this.getParameterByName("without_keywords")}`;
                let without_people = this.getParameterByName("without_people").length===0?"&without_people=":`&without_people=${this.getParameterByName("without_people")}`;
                let without_watch_providers = this.getParameterByName("without_watch_providers").length===0?"&without_watch_providers=":`&without_watch_providers=${this.getParameterByName("without_watch_providers")}`;
                let media_type = this.getParameterByName("media_type").length===0?"tv":`&media_type=${this.getParameterByName("media_type")}`;
                let language = this.getParameterByName("language").length===0?"&language=en-US":`&language=${this.getParameterByName("language")}`;

                url = baseURL + `?page=discover_results&p=${this.p}${media_type}${with_cast}${with_genres}${with_keywords}${with_people}${with_watch_providers}${without_cast}${without_genres}${without_keywords}${without_people}${without_watch_providers}${language}`;
                break;
            default:
                url = baseURL + `?page=trending&p=${this.p}`;
                break;
        }
        return url;
    }

    passThru = (screen,itemID,itemType) => {
        this.props.navAndBanner(screen, itemID, itemType);
        let url = this.getUrl(itemID,itemType);
        window.location = url;
    }
    updateTitle = (title) => {
        this.title = title;
        this.props.updateTitle(title);
    }
    
    updateSearch = (q,p) => {
        window.location = this.getUrl(null,null,q,p);
    }
    
    isLoggedIn = () => {
        return !! Cookies.get('active_session');
    }

    setWatchProviders = (providers) => {
    }

    render = () => {
        if(this.state.page === "trending"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <TrendingMedia lists={this.state.lists} updateLists={this.updateLists} region={this.region_code} p={this.state.p} passThru={(screen,itemID,itemType) => this.passThru(screen,itemID,itemType)}/>
                    </div>
                    <div className="right-side-container"></div>
                </div>
            );
        }
        else if(this.state.page === "topratedtv"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <TopRatedTV updateLists={this.updateLists} lists={this.state.lists} region={this.region_code} p={this.state.p} passThru={(screen,itemID,itemType) => this.passThru(screen,itemID,itemType)}/>
                    </div>
                    <div className="right-side-container"></div>
                </div>
            );
        }
        else if(this.state.page === "populartv"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <PopularTV updateLists={this.updateLists} lists={this.state.lists} region={this.region_code} p={this.state.p} passThru={(screen,itemID,itemType) => this.passThru(screen,itemID,itemType)}/>
                    </div>
                    <div className="right-side-container"></div>
                </div>
            );
        }
        else if(this.state.page === "popularmovies"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <PopularMovies updateLists={this.updateLists} lists={this.state.lists} region={this.region_code} p={this.state.p} passThru={(screen,itemID,itemType) => this.passThru(screen,itemID,itemType)}/>
                    </div>
                    <div className="right-side-container"></div>
                </div>
            );
        }
        else if(this.state.page === "discover"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <DiscoverComponent updateLists={this.updateLists} lists={this.state.lists} region={this.region_code} p={this.state.p} passThru={(screen,itemID,itemType) => this.passThru(screen,itemID,itemType)}/>
                    </div>
                    <div className="right-side-container"></div>
                </div>
            );
        }
        else if(this.state.page === "discover_results"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <DiscoverResults updateLists={this.updateLists} lists={this.state.lists} region={this.region_code} p={this.state.p} passThru={(screen,itemID,itemType) => this.passThru(screen,itemID,itemType)}/>
                    </div>
                <div className="right-side-container"></div>
            </div>
            );
        }
        else if(this.state.page === "list"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <ListDetails updateLists={this.updateLists} lists={this.state.lists} listName={getParameterByName('list_name')} region={this.region_code} p={this.state.p} list_id={this.list_id}/>
                    </div>
                <div className="right-side-container"></div>
            </div>
            );
        }
        else if(this.state.page === "details"){
            if(this.props.itemType === "movie"){
                return <div className="middle-content-container" id="top_banner">
                            <MovieDetails updateLists={this.updateLists} lists={this.state.lists} getRegionCode={this.getRegionCode} watchProviders={this.watchProviders} region={this.region_code} updateTitle={(title) => this.updateTitle(title)} ref={this.mediaDetailsRef} addToList={this.props.addToList} isloggedin={this.props.isloggedin} itemType={this.props.itemType} itemID={this.props.itemID} />
                        </div>
            }
            else if(this.props.itemType === "person"){
                return <div className="top-content-div" id="top_banner"><PersonDetails region={this.region_code} updateTitle={(title) => this.updateTitle(title)} ref={this.mediaDetailsRef} addToList={this.props.addToList} isloggedin={this.props.isloggedin} itemType={this.props.itemType} itemID={this.props.itemID} /></div>
            }
            else if(this.props.itemType === 'episode'){
                return <div getRegionCode={this.getRegionCode} className="top-content-div" id="top_banner"><TVEpisodeDetails updateLists={this.updateLists} lists={this.state.lists} watchProviders={this.watchProviders} region={this.region_code} updateTitle={(title) => this.updateTitle(title)} ref={this.mediaDetailsRef} addToList={this.props.addToList} isloggedin={this.props.isloggedin} itemType={this.props.itemType} itemID={this.props.itemID} season={this.episodeSeason} episode={this.episode}/></div>
            }
            else{
                return  <div className="middle-content-container" id="top_banner">
                            <TVSeriesDetails updateLists={this.updateLists} lists={this.state.lists} getRegionCode={this.getRegionCode} watchProviders={this.watchProviders} region={this.region_code} updateTitle={(title) => this.updateTitle(title)} ref={this.mediaDetailsRef} addToList={this.props.addToList} isloggedin={this.props.isloggedin} itemType={this.props.itemType} itemID={this.props.itemID} />
                        </div>
            }
        }
        else if(this.state.page === "search"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-topg" id="top_banner">
                        <SearchResults updateLists={this.updateLists} lists={this.state.lists} region={this.region_code} updateSearch={(q,p) => this.updateSearch(q,p)} q={this.q} language={"en-US"} adult={"false"} p={this.props.p} />
                    </div>
                    <div className="right-side-container"></div>
                </div>
            )
        }
        else if(this.state.page === "profile"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container left-justify" id="top_banner">
                        <Profile updateLists={this.updateLists} lists={this.state.lists} ref={this.profileRef} setWatchProviders={this.setWatchProviders} />
                    </div>
                <div className="right-side-container"></div>
            </div>
            )
        }
        else if(this.state.page === "pwdlanding"){
            return(
                <div className="top-content-div" id="top_banner"><PasswordLandingPage token={this.props.token} email={this.props.email} /></div>
            )
        }
        else if(this.state.page === "reqreset"){
            return(
                <div className="top-content-div" id="top_banner"><RequestPwdReset /></div>
            )
        }
        else if(this.state.page === "login"){
            return(
                    <div className="main-body-container">
                        <div className="left-side-container"></div>
                        <div className="middle-content-container left-justify" id="top_banner">    
                            <LoginPage />
                        </div>
                    <div className="right-side-container"></div>
            </div>

            )
        }
        else if(this.state.page === "register"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container left-justify" id="top_banner">    
                        <RegisterUser />
                    </div>
                    <div className="right-side-container"></div>
                </div>
            )
        }
        else if(this.state.page === "verifyaccount"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container left-justify" id="top_banner">
                        <VerifyAccount token={this.token} email={this.email} />
                    </div>
                    <div className="right-side-container"></div>
                </div>
            );
        }
        else if(this.state.page === "lists"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <ListsComponent updateLists={this.updateLists} lists={this.state.lists}/>
                    </div>
                    <div className="right-side-container"></div>
                </div>                
            )
        }
        else if(this.state.page === "favorites"){
            return(
                <div className="main-body-container">
                    <div className="left-side-container"></div>
                    <div className="middle-content-container content-room-at-the-top" id="top_banner">
                        <FavoritesDetails updateLists={this.updateLists} lists={this.state.lists} />
                    </div>
                    <div className="right-side-container"></div>
                </div>                
            )
        }
    }
}
export default AppContent;