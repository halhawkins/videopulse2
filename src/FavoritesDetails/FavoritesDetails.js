import { Component } from "react";
import apiClient from "../api";
import settings from "../settings";
import MediaSummary from "../MediaSummary/MediaSummary";

class FavoritesDetails extends Component{

    constructor(props){
        super(props);
        this.listName = '';
        this.mediaItems = [];
    }

    componentDidMount = () => {
        apiClient.get(`${settings.api_url}api/favorites`)
        .then(list_data => {
            list_data.data.forEach((element,i) => {
                this.listName = "Favorites";
                if(element.item_type === 'tv'){
                    element.item_type = 'tvshow';
                }
                this.mediaItems = list_data.data;
                this.forceUpdate();
            });
        });
    }

    render = () => {
        if(typeof this.mediaItems === 'undefined')
        return <></>
        else{
            return (
                <>
                    <div className="content-title"><h2 className="page-title">Your Favorites</h2></div>                       
                    {
                        this.mediaItems.length > 0?this.mediaItems.map((item,i) => {
                            return <MediaSummary size={"normal"} passThru={() => this.detailsPassThru("details",item.item_id,item.item_type==='tvshow'?'tv':'movie')} key={"item"+item.item_id} mediaID={item.item_id} mediaType={item.item_type==='tvshow'?'tv':'movie'} poster_path={item.item_type==="person"?item.profile_path:item.item_type==="episode"?item.still_path:item.poster_path} vote_average={item.vote_average} media_name={item.item_type==='tvshow'?item.item_title:item.item_title}/>
                        }):<></>
                    }
                </>
            )
        }
    }
}
export default FavoritesDetails;