import { Component } from "react";

class PageShortcuts extends Component{

    gotopage = (page) =>{
        window.location = `./?page=${page}`;
    }
    render(){
        let trendingButton = "nav-tab";
        let popTVButton = "nav-tab";
        let popMovieButton = "nav-tab";
        let exploreButton = "nav-tab";
        let selected = " nav-tab-selected";
        switch(this.props.activeScreen){
            case "discover":
                exploreButton += selected;
                break;
            case "populartv":
                popTVButton += selected;
                break;
            case "popularmovies":
                popMovieButton += selected;
                break;
            case "trending":
                trendingButton += selected;
                break;
            default:
                break;
        }
        return(
            <div className="navigation-tabs">
                <div className={trendingButton} onClick={() => this.gotopage("trending")}>Trending</div>
                <div className={popTVButton} onClick={() => this.gotopage("populartv")}>Popular TV</div>
                <div className={popMovieButton} onClick={() => this.gotopage("popularmovies")}>Popular Movies</div>
                <div className={exploreButton} onClick={() => this.gotopage("discover")}>Explore</div>
            </div>
        );
    }
}
export default PageShortcuts;