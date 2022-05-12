import axios from "axios";
import { Component } from "react";
import MediaSummary from "../MediaSummary/MediaSummary";
import settings from "../settings";
import { getParameterByName } from "../util";
import PaginationControl from "../PaginationControl/PaginationControl";
import HeroComponent from "../HeroComponent/HeroComponent";

class PopularTV extends Component{
    constructor(props) {
        super(props);
        this.language = 'en';
        this.state = {
            page: 1,
            items: []
        }
    }

    detailsPassThru = (screen,mediaID,mediaType) => {
        this.props.passThru(screen,mediaID,mediaType);
    }

    componentDidMount = () => {
        let lang,page;
        lang = getParameterByName('language');
        if(lang === null)
            lang = 'en';
        
        page = getParameterByName('p');
        if(page === null){
            page = "1";
        }
        this.language = lang;

        axios.get(`${settings.api_url}api/tv/popular?p=${page}&language=${lang}`)
        .then(data => {
            this.totalPages = data.data.total_pages;
            this.setState({
                page: page,
                totalPages: data.data.total_pages,
                items: data.data.results
            })
        });
    }
    render = () => {
        let items = this.state.items;
        let mn = "", bg = "";
        let mediaID, mediaType;
        if(typeof items === "undefined")
            return <div></div>
        else
            if(this.state.items.length > 0){
                bg = items[0]?.backdrop_path;
                mn = items[0]?.name;
                mediaID=items[0]?.id;
                mediaType=items[0]?.media_type;

            }
        return(
                <>
                    <div className="content-title"><h2 className="page-title">Popular Television Series{this.search}</h2></div>
                    <HeroComponent pagetype={"populartv"} title={mn} backdrop={bg} mediaID={mediaID} mediaType={mediaType}/>
                    
                    {items.map((item,i) => {
                            return <MediaSummary overview={item.overview} size={"normal"} passThru={() => this.detailsPassThru("details",item.id,"tv")} key={"item"+item.id} mediaID={item.id} mediaType={"tv"} poster_path={item.poster_path} vote_average={item.vote_average} media_name={item.name}/>
                        })
                    }
                    <PaginationControl contentPage="populartv" maxentries={10} pageNumberCallback={null} pageQueryVariable="page" q={null} currentPage={this.props.p} lastPage={this.state.totalPages} link={`?page=populartv&language=${this.language}&p=`} />
                </>
            );
    }
}
export default PopularTV;