import { Component, createRef } from "react";
import settings from "../settings";

class ReviewsSection extends Component{
    constructor(props){
        super(props);
        this.reviewsDiv = createRef(null);
        this.collapseButton = createRef(null);
        this.state = {
            reviews: []
        }
    }

    reviewClick = (content) => {
        this.props.callback(content);
    }

    componentDidMount = () => {
        fetch(
            `${settings.api_url}api/reviews?itemType=${this.props.itemType}&itemID=${this.props.itemID}`
            
        )
        .then(
            response => response.json()
        )
        .then(data => {
            this.setState({
                reviews: data.results
            })
            
        });
    }

    showHide = () => {
        if(this.reviewsDiv.current.classList.contains("reviews-collapsed")){
            this.reviewsDiv.current.classList.remove("reviews-collapsed");
            this.collapseButton.current.innerHTML = "Collapse reviews..."
        }
        else{
            this.reviewsDiv.current.classList.add("reviews-collapsed");
            this.collapseButton.current.innerHTML = "Show all reviews..."
        }
    }

    decodeHTML = function (html) {
        return html;
    };

    render = () => {
        if(this.state.reviews.length === 0){
            return <></>
        }
        return (
                <div className="reviews-container">
                    <div className="review"><h3>Reviews:</h3></div>
                    
                    {
                        this.state.reviews.map((item,i) => {
                            let retval = null;
                            /**
                             * to do: expand hyperlinks
                             */
                            console.log ("todo: Translate urls to hyperlinks in api proxy")

                            let content = item.content;
                            // alert(JSON.stringify(Object.keys(item.author_details),null,10));
                            const imgStyle = {width:"48px"};
                            retval = (
                                <div key={`reviews1-${i}`} className="review" id={"reviewDiv"+i}>
                                    <img src={`${settings.sm_poster_base}${item?.author_details?.avatar_path}`} style={imgStyle} alt=""/>
                                    <span className="movie-details-type">{item.author}</span>
                                    <p></p>
                                    <p style={{whiteSpace: "pre-line"}}>
                                    {this.decodeHTML(content)}</p>

                                </div>
                            )
                            return retval;
                        })
                    }
                    <div className="reviews-collapse-button show-all-reviews" ref={this.collapseButton} onClick={this.showHide}>Show all reviews...</div>
                </div>
        )
    }
}

export default ReviewsSection;