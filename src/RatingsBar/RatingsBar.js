import { Component } from "react";
import nostar from "../images/points0.png";
import halfstar from "../images/points10.png";
import onestar from "../images/points20.png";

class RatingsBar extends Component{
    constructor(props){
        super(props)
        this.verypoor = "#f54438";
        this.poor = "#edb447";
        this.good = "#97d648";
        this.excellent = "#299c2a";
        this.fullstars = 0;
        this.halfstars = 0;
        this.stars = [];
        this.state = {
            rating: this.props.rating
        }
    }

    remainder(score,pointsPerStar){
        let fullstars = 0;
      
        this.fullstars = Math.floor(score/pointsPerStar);
        this.halfstars = (score-(fullstars*pointsPerStar))%(pointsPerStar)>=10?1:0;
      
    }

    componentDidUpdate = (oldProps) => {
        if(oldProps.rating !== this.props.rating){
            this.remainder(this.props.rating,20);
            for(let i = 1; i <= this.fullstars; i++)
                this.stars.push(<img src={onestar} alt="" />);
            if(this.halfstars > 0)
                this.stars.push(<img src={halfstar} alt="" />);
            for(let i = this.fullstars+this.halfstars+1; i <= 5; i++){
                this.stars.push(<img src={nostar} alt="" />);
            }    
        }
    }
    
    componentDidMount = () => {
        this.remainder(this.props.rating,20);
        for(let i = 1; i <= this.fullstars; i++)
            this.stars.push(<img src={onestar} alt="" />);
        if(this.halfstars > 0)
            this.stars.push(<img src={halfstar} alt="" />);
        for(let i = this.fullstars+this.halfstars+1; i <= 5; i++){
            this.stars.push(<img src={nostar} alt="" />);
        }
        this.forceUpdate();
    }

    render = () => {
        return <div className="ratings-bar" title={"Rating " +this.props.rating}>{this.stars}</div>
    }
}
export default RatingsBar;