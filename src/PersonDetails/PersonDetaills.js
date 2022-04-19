import { Component } from "react";
import { createRef } from "react";
import settings from "../settings";
import fbicon from "../images/f_logo_RGB-Blue_1024.png";
import twittericon from "../images/Twitter social icons - circle - blue.png";
import Credits from "../Credits/Credits";
import thinPlus from "../images/thin-plus.png";
import ImagesPanel from "../ImagesPanel/ImagesPanel";

class PersonDetails extends Component{
    constructor(props) {
        super(props);
        this.reviewsDetails = createRef(null);
        this.country = "US"

        this.state = {
            title: "",
            data: {},
            credits: [],
        }
    }

    componentDidMount = () => {
        let url = "";
        url = `${settings.api_url}api/details/person?itemID=${this.props.itemID}`;
        fetch(
            url
        )
        .then(
            response => response.json()
        )
        .then(data => {
            let title = data.name;

            this.props.updateTitle(title);
            fetch(
                `${settings.api_url}api/combined_credits?personid=${this.props.itemID}`
            )
            .then(
                response => response.json()
            )
            .then(creditsData => {
                this.credits = creditsData.cast;

                this.setState({
                    data: data,
                    credits: creditsData
                });
            })
                    
        });
    }

    toggleTab = (e,tab) => {
        let selectedTab = e.target.dataset.view;

        if(this.activeTab === selectedTab){
            this.activeTab = null;
        }
        else{
            this.activeTab = selectedTab;
        }
        this.forceUpdate();
        
    }

    getTitle = () => {
        return this.state.title;
    }

    render = () => {
        let title = "";

        if(Object.keys(this.state.data).length > 0){
            title = this.state.data.name;
        }
        this.creds = [];
        let castTabClass = "tabs-tab",
        imagessTabClass = "tabs-tab";

        const social_icon = {
            width: "32px",
            marginRight: "12px"
        }
        let twitter = [], facebook = [];
        if(typeof this.state.data.external_ids !== "undefined"){
            if(this.state.data.external_ids.twitter !== "" && this.state.data.external_ids.twitter !== null)
                twitter.push(<a target={"_blank"} href={`https://www.twitter.com/${this.state.data.external_ids.twitter_id}`}><img style={social_icon} src={twittericon} alt="Twitter" title={title+" on Twitter"}/></a>);
            else
                twitter.push(<></>);

            if(this.state.data.external_ids.facebook !== "" && this.state.data.external_ids.facebook !== null)
                facebook.push(<a target={"_blank"} href={`https://www.facebook.com/${this.state.data.external_ids.facebook_id}`}><img style={social_icon} src={fbicon} alt="Facebook" title={title+" on Facebook"} /></a>);
            else
                facebook.push(<></>);
        }
        else
            twitter = "";

        return (
            <div className="movie-details-container">
                <div class="movie-details-top">
                    <div class="tabs-container">
                        <div ref={this.castTab} data-view="credits" class={castTabClass} onClick={this.toggleTab}>Credits</div> {/**  tabs-tab-selected */}
                        <div ref={this.recommendationsTab} data-view="images" class={imagessTabClass} onClick={this.toggleTab}>Images</div>
                    </div>
                    <div class="movie-description">                        
                        <div class="person-details-div"><em class="person-details-type">Person</em><h2>{title}</h2><img className="details-poster-image" src={settings.poster_base+this.state.data.profile_path} /></div>
                        <div style={{whiteSpace: "pre-line"}}>{this.state.data.biography}<p>{twitter}{facebook}</p></div>
                        <div className="add-to-list"><img src={thinPlus} alt="add to list" title="Add to list" onClick={this.props.addToList}/></div>
                    </div>
                    { this.activeTab === "credits"?<Credits ref={this.castPanel} itemType={this.props.itemType} itemID={this.props.itemID}/>:<></>}
                    { this.activeTab === "images"?<ImagesPanel ref={this.castPanel} images={this.state.data.images} itemType={this.props.itemType} itemID={this.props.itemID}/>:<></>}
                </div>

            </div>
        )
    }

}
export default PersonDetails;