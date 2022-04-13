import axios from "axios";
import { Component } from "react";
import ListDialog from "../ListDialog/ListDialog";
import MediaSummary from "../MediaSummary/MediaSummary";
import settings from "../settings";
import { getParameterByName } from "../util";

class ListDetails extends Component{

    constructor(props){
        super(props);
        this.listName = '';
        this.mediaItems = [];
        this.state = {
            mediaID: null,
            mediaType: null
        }
    }

    componentDidMount = () => {
        axios.get(`${settings.api_url}api/list?list_id=${this.props.list_id}`)
        .then(list_data => {
            list_data.data.items.forEach((element,i) => {
                this.listName = list_data.data.list_name;
                if(list_data.data.items[i].item_type === 'tv'){
                    list_data.data.items[i].item_type = 'tvshow';
                }
                this.mediaItems = list_data.data.items;
                this.forceUpdate();
            });
        });
    }

    render = () => {
        return (
            <>
            {/* {this.state.showAddToListDlg?<ListDialog closeDlg={this.closeDlg} mediaID={this.state.mediaID} mediaType={this.state.mediaType} />:<></>} */}
                <div className="content-title"><h2 className="page-title">List - {getParameterByName("list_name")}</h2></div>                       
                {
                    this.mediaItems.length > 0?this.mediaItems.map((item,i) => {
                        return <MediaSummary 
                            closeDlg={this.closeDlg} 
                            size={"normal"} 
                            passThru={() => this.detailsPassThru("details",item.item_id,item.item_type==='tvshow'?'tv':'movie')} 
                            key={"item"+item.item_id} mediaID={item.item_id} 
                            mediaType={item.item_type==='tvshow'?'tv':item.item_type} 
                            poster_path={item.item_type==="person"?item.profile_path:item.item_type==="episode"?item.poster_path:item.poster_path} 
                            vote_average={item.vote_average} 
                            media_name={item.item_type==='tvshow'?item.item_title:item.item_title}
                            season={item.season}
                            episode={item.episode}/>
                    }):<></>
                }
            </>
        )
    }
}
export default ListDetails;