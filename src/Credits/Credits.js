import { Component } from "react";
import settings from "../settings";
import defaultPoster from "../images/poster-placeholder.jpg";
import { uniqueID} from "../util";
import axios from "axios";

class Credits extends Component{
    constructor(props){
        super(props);
        this.person = props.itemID;
        this.state = {
            castCredits: [],
            crewCredits: []
        }
    }

    componentDidMount = () => {
        axios(
            `${settings.api_url}api/combined_credits?personid=${this.props.itemID}`
        )
        .then(data => {
            this.setState({
                castCredits: data.data.cast,
                crewCredits: data.data.crew 
            });
            this.forceUpdate();
        })
    }

    render = () => {
        let cast, crew;
        if(this.state.castCredits.length > 0){
            cast = this.state.castCredits.map((item,i)=>{
                let castItem;
                if(item.media_type === 'tv'){
                    let rdate = typeof(item.first_air_date)==="undefined"?"":item.first_air_date.substr(0,4);
                    let href = `?page=details&itemID=${item.id}&itemType=tv`;
                    castItem = 


                    <a key={uniqueID()} href={href} className="tv-season-container summary-small-size">
                        <div style={{display:"flex"}}>
                        <div style={{objectFit:"contain"}} className="small-poster-div">
                            <img className="small-poster" src={item.poster_path!==null?`${settings.poster_base}${item.poster_path}`:defaultPoster} style={{height:"120px"}} alt="movie poster"/>
                        </div>
                        <div className="cast-crew-item-details">
                            <div className="media-name">{item.name} {rdate!==""?"(":""}{rdate}{rdate!==""?")":""}</div>
                            <em style={{color: "orange"}}>{item.character}</em><br/>
                            {item.overview.length > 90?item.overview.substr(0,90)+"...":item.overview}

                        </div>
                        </div>
                    </a>
                }
                else{
                    let rdate = typeof(item.release_date)==="undefined"?"":item.release_date.substr(0,4);
                    let href = `?page=details&itemID=${item.id}&itemType=movie`;
                    castItem = 


                        <a key={uniqueID()} href={href} className="tv-season-container summary-small-size">
                        <div style={{display:"flex"}}>
                            <div className="small-poster-div">
                                <img className="small-poster" src={item.poster_path!==null?`${settings.poster_base}${item.poster_path}`:defaultPoster} style={{height:"120px"}} alt="movie poster"/>
                            </div>
                                <div className="cast-crew-item-details">
                                    <div className="media-name">{item.title} {rdate!==""?"(":""}{rdate}{rdate!==""?")":""}</div>
                                    <em style={{color: "orange"}}>{item.character}</em><br/>
                                    {item.overview.length > 90?item.overview.substr(0,90)+"...":item.overview}
                                </div>
                            </div>
                        </a>
                }
                return castItem;
            });
        }
        if(this.state.crewCredits.length > 0){
            crew = this.state.crewCredits.map((item,i)=>{
                let crewItem;
                if(item.media_type === 'tv'){
                    let href = `?page=details&itemID=${item.id}&itemType=tv`;
                    let rdate = typeof(item.first_air_date)==="undefined"?"":item.first_air_date.substr(0,4);
                    crewItem = 
                        <a key={uniqueID()} href={href} className="tv-season-container summary-small-size">
                        <div style={{display:"flex"}}>
                            <div className="small-poster-div">
                                <img className="small-poster" src={item.poster_path!==null?`${settings.poster_base}${item.poster_path}`:defaultPoster} style={{height:"120px"}} alt="movie poster"/>
                                <div className="cast-crew-item-details">
                                    <div className="media-name">{item.name} {rdate!==""?"(":""}{rdate}{rdate!==""?")":""}</div>
                                    <em style={{color: "orange"}}>{item.job}</em><br/>
                                    {item.overview.length > 90?item.overview.substr(0,90)+"...":item.overview}

                                </div>
                            </div>
                            </div>
                        </a>
                }
                else{
                    let href = `?page=details&itemID=${item.id}&itemType=movie`;
                    let rdate = typeof(item.release_date)==="undefined"?"":item.release_date.substr(0,4);
                    crewItem = 
                        <a key={uniqueID()} href={href} className="tv-season-container summary-small-size">
                        <div style={{display:"flex"}}>
                            <div className="small-poster-div">
                                <img className="small-poster" src={item.poster_path!==null?`${settings.poster_base}${item.poster_path}`:defaultPoster} style={{height:"120  px"}} alt="movie poster"/>
                                <div className="cast-crew-item-details">
                                    <div className="media-name">{item.title} {rdate!==""?"(":""}{rdate}{rdate!==""?")":""}</div>
                                    <em style={{color: "orange"}}>{item.job}</em><br/>
                                    {item.overview.length > 90?item.overview.substr(0,90)+"...":item.overview}

                                </div>
                            </div>
                            </div>
                        </a>
                }
                return crewItem;
            });
        }
        return(
            <div className="cast-panel">
                {/* <div className="credits-inner-container"> */}
                    <div><h3>As cast member:</h3></div>
                    {cast}
                    <div><h3>As crew member:</h3></div>
                    {crew}
                {/* </div> */}
            </div>
        );
    }
}

export default Credits;