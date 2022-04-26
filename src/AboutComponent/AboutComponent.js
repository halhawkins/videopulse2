import { Component } from "react";
import logo from "../images/videopulse-outline-lg.png";

class AboutComponent extends Component{

    render = () => {
        return(
            <div className="about-container">
                <h2>About VideoPulse</h2>
                <div className="about-brand-graphic"><img src={logo} alt="logo" /></div><p>
                VideoPulse was concieved of as a site where freinds and family would be able to find video content to watch and 
                create lists of shows we had watched, shows we want to watch or just to categorize video content. As of the time I 
                am writing this, VideoPulse is in its infancy and we have many features that are yet-to-come.</p>
                <p>My hopes are that you may find VideoPulse useful and a pleasure to use. Please feel free to share links to movies, series, episodes and people involved 
                    in the creation of your favorite movies and TV. 
                </p>
            </div>
        );
    }
}
export default AboutComponent;