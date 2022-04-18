import axios from "axios";
import { Component } from "react";
import MediaSummary from "../MediaSummary/MediaSummary";
import settings from "../settings";
import PaginationControl from "../PaginationControl/PaginationControl";
import { uniqueID } from "../util";

class TrendingMedia extends Component{
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
        // if(prevProps.p !== this.props.p){
            
        //     axios.get(`${settings.api_url}api/trending?p=${this.props.p}`)
        //     .then(data => {
        //         this.totalPages = data.data.total_pages;
        //         this.setState({
        //             totalPages: data.data.total_pages,
        //             items: data.data.results
        //         })
        //     });    
        // }
    }
    
    pageNumberCallback = (pageno) => {
        // this.props.updateSearch(this.props.q,pageno);
    }


    componentDidMount = () => {
        axios.get(`${settings.api_url}api/trending?p=${this.props.p}`)
        .then(data => {
            document.title = `VideoPulse - Trending TV, Movies and Personalities`;
            this.totalPages = data.data.total_pages;
            // this.pagination = 
            this.setState({
                totalPages: data.data.total_pages,
                items: data.data.results
            })
        });
    }
    render = () => { 
        let items = this.state.items;
        
        if(typeof items === "undefined")
            return <></>
        else
            return(
                <>
                    <div className="content-title"><h2 className="page-title">Trending</h2></div>
                    {items.map((item,i) => {
                            
                            return <MediaSummary updateLists={this.props.updateLists} lists={this.props.lists} overview={item.overview} size={"normal"} passThru={() => this.detailsPassThru("details",item.tmdb_id,item.media_type)} key={uniqueID()} mediaID={item.tmdb_id} mediaType={item.media_type} poster_path={item.poster_path} vote_average={item.vote_average} media_name={item.media_name}/>
                        })
                    }
                
                <PaginationControl contentPage="trending" maxentries={10} pageNumberCallback={null} pageQueryVariable="page" q={null} currentPage={this.props.p} lastPage={this.state.totalPages} link={`?page=trending&p=`} />
                </>
            );
    }
}
export default TrendingMedia;