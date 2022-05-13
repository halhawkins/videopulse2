import axios from "axios";
import { Component } from "react";
import MediaSummary from "../MediaSummary/MediaSummary";
import settings from "../settings";
import PaginationControl from "../PaginationControl/PaginationControl";
import '../vp.css';

class TopRatedTV extends Component{
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }

    detailsPassThru = (screen,mediaID,mediaType) => {
        this.props.passThru(screen,mediaID,mediaType);
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.p !== this.props.p){
            let lang;
            if(typeof(this.props.lang) !== 'undefined')
                lang = 'en-US';
            else
                lang = this.props.lang;

            axios.get(`${settings.api_url}api/TV/TopRated?p=${this.props.p}&language=${lang}`)
            .then(data => {
                this.totalPages = data.data.total_pages;
                this.setState({
                    totalPages: data.data.total_pages,
                    items: data.data.results
                })
            });    
        }
    }

    componentDidMount = () => {
        let lang;
        if(typeof(this.props.lang) !== 'undefined')
            lang = 'en-US';
        else
            lang = this.props.lang;
        axios.get(`${settings.api_url}api/tv/toprated?p=${this.props.p}&language=${lang}`)
        .then(data => {
            this.totalPages = data.data.total_pages;
            this.setState({
                totalPages: data.data.total_pages,
                items: data.data.results
            })
        });
    }
    render = () => {
        let items = this.state.items;
        let lang;
        if(typeof(this.props.lang) !== 'undefined')
            lang = 'en-US';
        else
            lang = this.props.lang;
        if(typeof items === "undefined")
            return <></>
        else
            return(
                <>
                <div className="content-title"><h2 className="page-title">Trending</h2></div>
                    {items.map((item,i) => {
                            return <MediaSummary overview={item.overview} size={"normal"} passThru={() => this.detailsPassThru("details",item.id,"tv")} key={"item"+item.id} mediaID={item.id} mediaType={"tv"} poster_path={item.poster_path} vote_average={item.vote_average} media_name={item.name}/>
                        })
                    }
                    <PaginationControl contentPage="topratedtv" maxentries={5} pageNumberCallback={null} pageQueryVariable="page" q={null} currentPage={this.props.p} lastPage={this.state.totalPages} link={`?page=trending&p=`} />
                </>
            );
    }
}
export default TopRatedTV;