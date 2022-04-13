import { Component } from "react";
import VideoPreview from "../VideoPreview/VideoPreview";
import settings from '../settings';
// const {google} = require('googleapis');

class RelatedVideos extends Component{
    constructor(props){
        super(props);
    
        this.state = {
            selectedItem: null,
            results: null
        }
    }

    componentDidMount = () => {
          
        const itemType = this.props.itemType;
        const itemID = this.props.itemID;
        let URL = `${settings.api_url}api/relatedvideos?itemType=${itemType}&itemID=${itemID}`;
        fetch(
            URL
        )
        .then(
            response => response.json()
            
        )
        .then(TMDdata => {
            let videos = TMDdata.results.map(item => {
                return item.key
            })

            fetch(
                "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + videos.join() + `&key=${settings.you_tube_key}`
            )
            .then(
                response => response.json()
            )
            .then(
                results => {
                    let tmp = results.items.map(item => {
                        // if(item.kind === "youtube#video") 
                            return {
                                id: item.id,
                                thumbnail: item.snippet.thumbnails.default.url,
                                title: item.snippet.title,
                                tags: item.snippet.tags
                            }
                    })
                    if(tmp.length > 0)
                    this.setState({
                        results: tmp
                    })
                }
            )


        });
}

    render = () => {
        return (
            <div className="video-preview-component-container">
            {/* <div className="related-videos-section"> */}
                <VideoPreview key="videopreviewComponent" videos={this.state.results}/>
            {/* </div> */}
            </div>
        )
    }
}
export default RelatedVideos;