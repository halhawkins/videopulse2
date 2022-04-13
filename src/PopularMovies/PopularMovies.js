import axios from "axios";
import { Component } from "react";
import MediaSummary from "../MediaSummary/MediaSummary";
import settings from "../settings";
import { getParameterByName } from "../util";
import PaginationControl from "../PaginationControl/PaginationControl";

class PopularMovies extends Component{

    constructor(props) {
        super(props);
        this.lang = 'en';
        this.pageno = 1;
        this.state = {
            items: []
        }
    }

    detailsPassThru = (screen,mediaID,mediaType) => {
        this.props.passThru(screen,mediaID,mediaType);
    }

    
    pageNumberCallback = (pageno) => {
    }

    componentDidMount = () => {
        this.pageno = getParameterByName("p") === null?1:getParameterByName("p");
        document.title = "VideoPulse Popular Movies";
        this.lang = getParameterByName("language") === null?"en":getParameterByName("language");

        axios.get(`${settings.api_url}api/movies/popular?p=${this.pageno}&language=${this.lang}`)
        .then(data => {
            this.totalPages = data.data.total_pages;
            this.setState({
                page: this.pageno,
                totalPages: data.data.total_pages,
                items: data.data.results
            })
        });
    }
    render = () => {
        let items = this.state.items;
        if(typeof items === "undefined"){
            return <div></div>
        }
        else
            // if( === "popularmovies")
            return(
                <>
                    <div className="content-title"><h2 className="page-title">Popular Movies{this.search}</h2></div>
                    {items.map((item,i) => {
                            return <MediaSummary size={"normal"} passThru={() => this.detailsPassThru("details",item.id,"movie")} key={"item"+item.id} mediaID={item.id} mediaType={"movie"} poster_path={item.poster_path} vote_average={item.vote_average} media_name={item.title}/>
                        })
                    }
                    <PaginationControl contentPage="popularmovies" maxentries={10} pageNumberCallback={null} pageQueryVariable="page" q={null} currentPage={this.props.p} lastPage={this.state.totalPages} link={`?page=popularmovies&language=${this.lang}&p=`} />
                </>
            );
    }
}
export default PopularMovies;