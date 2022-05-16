import axios from "axios";
import { Component } from "react";
import MediaSummary from "../MediaSummary/MediaSummary";
import settings from "../settings";
import PaginationControl from "../PaginationControl/PaginationControl";
import { removePageParam, getParameterByName  } from "../util";

class DiscoverResults extends Component{
    constructor(props) {
        super(props);
        this.pageno = 1;
        this.state = {
            items: [],
            media_type: "tv",
            loading: true
        }
    }

    detailsPassThru = (screen,mediaID,mediaType) => {
        this.props.passThru(screen,mediaID,mediaType);
    }

    getParameterByName = (name, url = window.location.href) => {
        const params = new URLSearchParams(window.location.search);
          return params.get(name);
    }
  
    componentDidUpdate = (prevProps) => {
        let with_cast = this.getParameterByName('with_cast')===null?"":`&with_cast=${this.getParameterByName('with_cast')}`;
        let with_genres = this.getParameterByName("with_genres")===null?"":`&with_genres=${this.getParameterByName("with_genres")}`;
        let with_keywords = this.getParameterByName("with_keywords")===null?"":`&with_keywords=${this.getParameterByName("with_keywords")}`;
        let with_people = this.getParameterByName("with_people")===null?"":`&with_people=${this.getParameterByName("with_people")}`;
        let with_watch_providers = this.getParameterByName("with_watch_providers")===null?"":`&with_watch_providers=${this.getParameterByName("with_watch_providers")}`;
        let watch_region = this.getParameterByName("watch_region")===null?"":`&watch_region=${this.getParameterByName("watch_region")}`;

        let without_cast = this.getParameterByName('without_cast')===null?"":`&without_cast=${this.getParameterByName('without_cast')}`;
        let without_genres = this.getParameterByName("without_genres")===null===0?"":`&without_genres=${this.getParameterByName("without_genres")}`;
        let without_keywords = this.getParameterByName("without_keywords")===null===0?"":`&without_keywords=${this.getParameterByName("without_keywords")}`;
        let without_people = this.getParameterByName("without_people")===null===0?"":`&without_people=${this.getParameterByName("without_people")}`;
        let without_watch_providers = this.getParameterByName("without_watch_providers")===null?"":`&without_watch_providers=${this.getParameterByName("without_watch_providers")}`;
        let media_type = this.getParameterByName("media_type")===null?"tv":`&media_type=${this.getParameterByName("media_type")}`;
        if(prevProps.p !== this.props.p){
            let p;
            let lang;
            if(this.getParameterByName('language')===null)
                lang = 'en-US';
            else
                lang = this.getParameterByName('language');
            if(typeof(this.props.p) === 'undefined')
                p = "1";
            else
                p = this.props.p;
            this.p = this.getParameterByName("p");
            this.url = `${settings.api_url}api/${media_type}/discover?p=${p}&language=${lang}${with_cast}${with_genres}${with_keywords}${with_people}${with_watch_providers}${without_cast}${without_genres}${without_keywords}${without_people}${watch_region}${without_watch_providers}`;
            axios.get(this.url)
            .then(data => {
                this.totalPages = data.data.total_pages;
                this.setState({
                    totalPages: data.data.total_pages,
                    items: data.data.results,
                    media_type: media_type,
                    loading: false
                })
            });    
        }
    }
    
    pageNumberCallback = (pageno) => {
    }


    componentDidMount = () => {
        let lang;
        let with_cast = "",
        with_genres = "",
        with_keywords = "",
        with_people = "",
        with_watch_providers = "",
        without_cast = "",
        without_genres = "",
        without_keywords = "",
        without_people = "",
        without_watch_providers = "",
        media_type = "",
        watch_region = "";

        with_cast = typeof this.getParameterByName('with_cast')!=="string"?"":`&with_cast=${this.getParameterByName('with_cast')}`;
        with_genres = typeof this.getParameterByName("with_genres")!=="string"?"":`&with_genres=${this.getParameterByName("with_genres")}`;
        with_keywords = typeof this.getParameterByName("with_keywords")!=="string"?"":`&with_keywords=${this.getParameterByName("with_keywords")}`;
        with_people = typeof this.getParameterByName("with_people")!=="string"?"":`&with_people=${this.getParameterByName("with_people")}`;
        with_watch_providers = typeof this.getParameterByName("with_watch_providers")!=="string"?"":`&with_watch_providers=${this.getParameterByName("with_watch_providers")}`;
        watch_region = typeof this.getParameterByName("watch_region")!=="string"?"":`&watch_region=${this.getParameterByName("watch_region")}`;

        without_cast = typeof this.getParameterByName('without_cast')!=="string"?"":`&without_cast=${this.getParameterByName('without_cast')}`;
        without_genres = typeof this.getParameterByName("without_genres")!=="string"?"":`&without_genres=${this.getParameterByName("without_genres")}`;
        without_keywords = typeof this.getParameterByName("without_keywords")!=="string"?"":`&without_keywords=${this.getParameterByName("without_keywords")}`;
        without_people = typeof this.getParameterByName("without_people")!=="string"?"":`&without_people=${this.getParameterByName("without_people")}`;
        without_watch_providers = typeof this.getParameterByName("without_watch_providers")!=="string"?"":`&without_watch_providers=${this.getParameterByName("without_watch_providers")}`;
        media_type = typeof this.getParameterByName("media_type")!=="string"?"tv":`${this.getParameterByName("media_type")}`;
        let p;
        if(typeof(this.getParameterByName("language")) !== 'string'){
            lang = '&language=en-US';
            this.lang = "en-US";
        }
        else{
            lang = `&language=${this.getParameterByName("language")}`;
            this.lang = this.getParameterByName("language");
        }
        if(typeof(this.getParameterByName("p")) !== 'string')
            p = "?p=1";
        else
            p = `?p=${this.getParameterByName("p")}`;
        
        this.p = this.getParameterByName("p"); 
        

        this.url = `${settings.api_url}api/${media_type}/discover${p}${lang}${with_cast}${with_genres}${with_keywords}${with_people}${with_watch_providers}${without_cast}${without_genres}${without_keywords}${without_people}${without_watch_providers}${watch_region}`
        axios.get(this.url)
        .then(data => {
            this.totalPages = data.data.total_pages;
            this.setState({
                totalPages: data.data.total_pages,
                items: data.data.results,
                loading: false,
                media_type: media_type
            })
        });
    }

    render = () => {
        let items = this.state.items;
        let media_type = this.getParameterByName("media_type");

        if(typeof items === "undefined")
            return <></>
        else
            return(
                <>
                    <div className="content-title"><h2 className="page-title">Discover {media_type.replace(/^\w/, (c) => c.toUpperCase())}</h2></div>
                    {items.map((item,i) => {
                            return <MediaSummary overview={item.overview} size={"normal"} passThru={() => this.detailsPassThru("details",item.id,media_type)} key={"item"+item.id} mediaID={item.id} mediaType={media_type} poster_path={item.poster_path} vote_average={item.vote_average} media_name={media_type==="movie"?item.title:item.name}/>
                        })
                    }
                    <PaginationControl contentPage="discover_results" maxentries={5} pageNumberCallback={null} pageQueryVariable="page" q={null} currentPage={getParameterByName('p')===null?1:this.getParameterByName('p')} lastPage={this.state.totalPages} link={removePageParam(window.location.search)+"&p="} />
                </>
            );
    }
}
export default DiscoverResults;