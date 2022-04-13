import { Component, createRef } from "react";
import Cookies from 'js-cookie';

import SearchTagsDialog from "../SearchTagsDialog/SearchTagsDialog";
import fakeadd from "../images/sample-ad.png";
import TagField from "../TagField/TagField";

class DiscoverComponent extends Component{

    constructor(props){
        super(props);

        this.addDialog = createRef(null);
        this.wkeywordtags = createRef(null);
        this.wnamestags = createRef(null);
        this.wcasttagfield = createRef(null);
        this.wcrewmembertags = createRef(null);
        this.wgenretags = createRef(null);
        this.wwatchprovidertags = createRef(null);

        this.wokeywordtags = createRef(null);
        this.wonamestags = createRef(null);
        this.wocrewmembertags = createRef(null);
        this.wogenretags = createRef(null);
        this.wowatchprovidertags = createRef(null);
        this.withCriteria = createRef(null);
        this.woCriteria = createRef(null);
        this.autocomp = createRef(null);
        this.TVToggle = createRef(null);
        this.MoviesToggle = createRef(null);
        this.wcastsection = createRef(null);
        this.wcrewsection = createRef(null);
        this.wocastsection = createRef(null);
        this.wocrewsection = createRef(null);
        this.wowatchproviderssection = createRef(null);
        this.tagsDlg = createRef(null);

        this.region = "US";
        this.wregionSelect = createRef(null)
        this.woregionSelect = createRef(null)
        this.currentField = null;
        this.hasPeople = false;


        this.state = {
            tvormovies: "tv",
            dlgVisible: false,
            results: false,
            dlg: ""
        }
    }

    isLoggedIn = () => {
        return !! Cookies.get('active_session');
    }    

    handleTVMovieToggle = e =>{
        // let tvormovies = this.state.tvormovies;
        if(this.state.tvormovies === 'tv'){
            this.TVToggle.current.classList.replace("toggle-selected","toggle");
            this.MoviesToggle.current.classList.replace("toggle","toggle-selected");
            this.hasPeople = false;
            this.wcastsection.current.classList.remove("hide");
            this.wcrewsection.current.classList.remove("hide");
            this.wocastsection.current.classList.remove("hide");
            this.wocrewsection.current.classList.remove("hide");
            this.wowatchproviderssection.current.classList.remove("hide");
        }
        else{
            this.MoviesToggle.current.classList.replace("toggle-selected","toggle");
            this.TVToggle.current.classList.replace("toggle","toggle-selected");
            this.hasPeople = true;
            this.wcastsection.current.classList.add("hide");
            this.wcrewsection.current.classList.add("hide");
            this.wocastsection.current.classList.add("hide");
            this.wocrewsection.current.classList.add("hide");
            this.wowatchproviderssection.current.classList.add("hide");
        }
        let text = document.querySelector(".toggle-selected").innerText.toLowerCase();
        if(text === "movies")
            text = "movie"
        this.forceUpdate();
        this.setState({
            tvormovies: text
        })
    }

    getURL = () => {
        let castURL="", 
            genresURL="", 
            keywordsURL="", 
            crewURL="", 
            providersURL =  "",
            // wregion = this.props.region,
            wocastURL = "",
            wogenresURL = "",
            wokeywordsURL = "",
            wocrewURL = "",
            woprovidersURL = "";
            // woregion = "",
            // wregionURL = "";

        if(this.hasPeople){
            let cast = this.wnamestags.current.getTags();
            if(cast.length > 0){
                castURL =  "&with_cast=";
                for(let i = 0; i < cast.length; i++){
                    castURL += cast[i].value;
                    castURL += i === cast.length-1?"":",";
                }
            }
        }

        let genres = this.wgenretags.current.getTags();
        if(genres.length > 0){
            genresURL = "&with_genres=";
            for(let i = 0; i < genres.length; i++){
                genresURL += genres[i].value;
                genresURL += i === genres.length-1?"":",";
            }
        }

        let keywords = this.wkeywordtags.current.getTags();
        if(keywords.length > 0){
            keywordsURL += "&with_keywords=";
            for(let i = 0; i < keywords.length; i++){
                keywordsURL += keywords[i].value;
                keywordsURL += i === keywords.length-1?"":",";
            }
        }

        if(this.hasPeople){
            let crew = this.wcrewmembertags.current.getTags();
            if(crew.length > 0){
                crewURL += "&with_people=";
                for(let i = 0; i < crew.length; i++){
                    crewURL += crew[i].value;
                    crewURL += i === crew.length-1?"":",";
                }
            }
        }

        let providers = this.wwatchprovidertags.current.getTags();
        if(providers.length > 0){
            providersURL += "&with_watch_providers=";
            for(let i = 0; i < providers.length; i++){
                providersURL += providers[i].value;
                providersURL += i === providers.length-1?"":",";
            }
        }

        let wogenres = this.wogenretags.current.getTags();
        if(wogenres.length > 0){
            wogenresURL = "&without_genres=";
            for(let i = 0; i < wogenres.length; i++){
                wogenresURL += wogenres[i].value;
                wogenresURL += i === wogenres.length-1?"":",";
            }
        }

        let wokeywords = this.wokeywordtags.current.getTags();
        if(wokeywords.length > 0){
            wokeywordsURL += "&without_keywords=";
            for(let i = 0; i < wokeywords.length; i++){
                wokeywordsURL += wokeywords[i].value;
                wokeywordsURL += i === wokeywords.length-1?"":",";
            }
        }

        let url = `${window.location.origin}?page=discover_results&media_type=${this.state.tvormovies}&language=en-US${castURL}${genresURL}${keywordsURL}${crewURL}${providersURL}${wocastURL}${wogenresURL}${wokeywordsURL}${wocrewURL}${woprovidersURL}&watch_region=${this.props.region}&p=1`;
        window.location = url;
    }

    handleTVMovieToggle = e =>{
        // let tvormovies = this.state.tvormovies;
        if(this.state.tvormovies === 'tv'){
            this.TVToggle.current.classList.replace("toggle-selected","toggle");
            this.MoviesToggle.current.classList.replace("toggle","toggle-selected");
            this.hasPeople = true;
        }
        else{
            this.MoviesToggle.current.classList.replace("toggle-selected","toggle");
            this.TVToggle.current.classList.replace("toggle","toggle-selected");
            this.hasPeople = false;
        }
        let text = document.querySelector(".toggle-selected").innerText.toLowerCase();
        if(text === "movies")
            text = "movie"
        
        this.setState({
            tvormovies: text
        })
    }
    
    getTags = () => {
        let tf = null;
        let currentTagField;
        tf = this.tagsDlg.current.getTags();
        switch(this.currentField){
            case "cast":
                tf.forEach(element => {
                    this.wnamestags.current.addTagItem(element.value,element.name);
                });
                currentTagField = this.wnamestags.current;
                break;
            case "crew":
                tf.forEach(element => {
                    this.wcrewmembertags.current.addTagItem(element.value,element.name);
                });
                currentTagField = this.wcrewmembertags.current;
                break;
            case "genres":
                tf.forEach(element => {
                    this.wgenretags.current.addTagItem(element.value,element.name);
                });
                currentTagField = this.wgenretags.current;
                break;
            case "keywords":
                tf.forEach(element => {
                    this.wkeywordtags.current.addTagItem(element.value,element.name);
                });
                currentTagField = this.wkeywordtags.current;
                break;
            case "providers":
                tf.forEach(element => {
                    this.wwatchprovidertags.current.addTagItem(element.value,element.name);
                });
                currentTagField = this.wwatchprovidertags.current;
                break;
            case "wogenres":
                tf.forEach(element => {
                    this.wogenretags.current.addTagItem(element.value,element.name);
                });
                currentTagField = this.wogenretags.current;
                break;
            case "wokeywords":
                currentTagField = this.wokeywordtags.current;
                break;
            default:
                break;
        }
        tf.forEach(element => {
            currentTagField.addTagItem(element.value,element.name);
        });
        this.setState({
            dlgVisible: false
        })
    }

    handleTagFieldClick = (field) => {
        this.currentField = field;
        this.setState({
            dlgVisible: true,
            dlg: field
        });
    }

    render = () => {
            let dlg;
            let hasPeople;
            if(this.hasPeople){
                hasPeople = <><TagField ref={this.wnamestags} label="Cast" tagtype="person" clickHandler={() => this.handleTagFieldClick("cast")}/>
                <TagField ref={this.wcrewmembertags} label="Crew" tagtype="person" clickHandler={() => this.handleTagFieldClick("crew")}/></>
            }  
            else{
                hasPeople = <></>
            }
            if(this.state.dlgVisible === false)
                dlg = <></>
            else{
                switch(this.state.dlg){
                    case "cast":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"cast"} label={"Cast"} />
                        break;
                    case "crew":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"crew"} label={"Crew"} />
                        break;
                    case "keywords":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"keywords"} label={"Keywords"} />
                        break;
                    case "genres":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"genres"} label={"Genres"} />
                        break;
                    case "providers":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"providers"} label={"Watch Providers"} />
                        break;
                    case "wokeywords":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"keywords"} label={"Excluding Keywords"} />
                        break;
                    case "wogenres":
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"genres"} label={"Excluding Genres"} />
                        break;
                    default:
                        dlg = <SearchTagsDialog hidden={true} ref={this.tagsDlg} getTags={this.getTags} tagType={"providers"} label={"Excluding Watch Providers"} />
                        break;
                            
                }
            }
            return (
                    <div className="discover-container">
                        <h2>Discover TV and Movies</h2>
                        <div ref={this.TVToggle} onClick={this.handleTVMovieToggle} className="toggle-selected left-slider">TV</div><div ref={this.MoviesToggle} onClick={this.handleTVMovieToggle} className="toggle right-slider">Movies</div>
                        <h3>Include</h3>
                        <div className="tagfield-section">
                            {hasPeople}
                            <TagField ref={this.wgenretags} label="Genres" tagtype="genres" clickHandler={() => this.handleTagFieldClick("genres")}/>
                            <TagField ref={this.wkeywordtags} label="Keywords" tagtype="keywords" clickHandler={() => this.handleTagFieldClick("keywords")}/>
                            <TagField ref={this.wwatchprovidertags} label="Watch Providers" tagtype="providers" clickHandler={() => this.handleTagFieldClick("providers")}/>
                        </div>
                        {dlg}
                        <div style={{flex: "0 0 100%"}}><h3>Exlude:</h3></div>
                        <div className="tagfield-section">
                            <TagField ref={this.wogenretags} label="Exclude Genres" tagtype="genres" clickHandler={() => this.handleTagFieldClick("wogenres")}/>
                            <TagField ref={this.wokeywordtags} label="Exclude Keywords" tagtype="keywords" clickHandler={() => this.handleTagFieldClick("wokeywords")}/>
                        </div>
                        <button className="vp-button" onClick={this.getURL} >Submit</button>
                    </div>

            );
    }

}
export default DiscoverComponent;