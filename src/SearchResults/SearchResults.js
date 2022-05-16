import axios from "axios";
import { Component } from "react";
import PaginationControl from "../PaginationControl/PaginationControl";
import settings from "../settings";
import MediaSummary from "../MediaSummary/MediaSummary";
import {getParameterByName} from "../util";

class SearchResults extends Component{
    constructor(props) {
        super(props);
        this.language = this.props.language === null?"en-US":this.props.language
        this.adult = this.props.adult === null?"false":this.props.adult;
        this.totalPages = 1;
        let page = this.props.p === null?1:this.props.p;
        this.search = "";
        this.lang="en";
        this.state = {
            data: null,
            page: page
        }
    }

    componentDidMount = () => {
        this.search = getParameterByName("q");
        let pageno = getParameterByName("p") === null?1:getParameterByName("p");
        axios(`${settings.api_url}api/search?q=${this.props.q}&p=${pageno}`)
        .then(data => {
            this.totalPages = data.data.total_pages;
            this.search = this.props.q === null?getParameterByName("q"):this.props.q;
            this.setState({
                data: data.data,
                page: pageno
            })
        });
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.p !== this.props.p){
            this.setState({
                page: this.props.p
            })
        }
    }
    
    detailsPassThru = (screen,mediaID,mediaType) => {
        window.location = `?page=details&itemID=${mediaID}&itemType=${mediaType}`;
        this.props.passThru(screen,mediaID,mediaType);
    }

    pageNumberCallback = (pageno) => {
        this.props.updateSearch(this.props.q,pageno);
    }
    
    render = () => {
        let items;
        if(this.state.data !== null){
            if(typeof this.state.data.results !== "undefined"){
                if(this.state.data.results !== null){
                    items = this.state.data.results;
                }
                else{
                    items = [];
                }
            }
            else{
                items = [];
            }
        }
        
        if(this.state.data === null)
            return <></>
        return (
            <>
                <div className="content-title"><h2 className="page-title">Search results for: &nbsp; {this.search}</h2></div>
                    {items.map((item,i) => {
                            return <MediaSummary overview={item.overview} size={"normal"} passThru={() => this.detailsPassThru("details",item.id,"movie")} key={"item"+item.id} mediaID={item.id} mediaType={item.media_type} poster_path={item.media_type==="tv"||item.media_type==="movie"?item.poster_path:item.profile_path} vote_average={item.vote_average} media_name={item.media_type === 'tv'||item.media_type==='person'?item.name:item.title}/>
                        })
                    }
                <PaginationControl contentPage="searchresults" maxentries={5} pageNumberCallback={null} pageQueryVariable="page" q={this.props.q} currentPage={this.state.data.page} lastPage={this.state.data.total_pages} link={`?page=search&language=${this.lang}&q=${getParameterByName("q")}&p=`} />
            </>
        )
    }
}
export default SearchResults;