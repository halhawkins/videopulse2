import { Component,createRef } from "react";

class VideoPreview extends Component{
    constructor(props){
        super(props);
        this.thumbRef = [];
        this.thumbList = createRef(null);
        this.scrollPosition = 0;
        this.state = {
            selected: 0
        }
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.videos !== this.props.videos){
            if(this.props.videos !== null)
                for(let i = 0;i < this.props.videos.length; i++){
                    this.thumbRef[i] = createRef(null)
                }
            this.setState({
                selected: 0
            })
        }
    }

    selectVideo = i => {
        this.thumbRef[this.state.selected].current.classList.remove("selected-thumb");
        this.thumbRef[i].current.classList.add("selected-thumb");
        this.setState({
            selected: i
        })
    }

    scrollListLeft = () => {
        let scrollDistance = 130;
        if(this.scrollPosition >= this.thumbList.current.width-scrollDistance)
            this.scrollPosition = this.thumbList.current.width-scrollDistance;
        else
            this.scrollPosition += scrollDistance;
        document.getElementById("thumblist").firstChild.scrollTo(this.scrollPosition,0);
    }

    scrollListRight = () => {

        let scrollDistance = 130;
        if(this.scrollPosition <= 0)
            this.scrollPosition = 0;
        else
            this.scrollPosition -= scrollDistance;
        document.getElementById("thumblist").scrollTo(this.scrollPosition,0);
    }

    render = () => {
        if(this.props.videos !== null){
            return ( // iframe old className="video-player"
            <div className="video-preview-component">
  <div className="video-section">
    <div className="video-player">
      <iframe allowFullScreen={true} title="ytplayer" frameBorder="0" src={"https://www.youtube.com/embed/" + this.props.videos[this.state.selected].id}></iframe>
    </div>
    <div className="video-selector">
     <div onClick={this.scrollListRight} className="thumb-list-left-btn">
     </div>
     <div className="thumb-list-container" ref={this.thumbList}>
     <div id="thumblist" className="thumb-list">
     {
        this.props.videos.map((item,i) => {
            let imgClass = "deselected-thumb"; 
            if(i === this.state.selected)
                imgClass = "selected-thumb";
            else
                imgClass = "deselected-thumb";
            return(
            <img key={`img1-${i}`} className={imgClass} onClick={() => this.selectVideo(i)} ref={this.thumbRef[i]} src={item.thumbnail} alt="thumbnail" />
            )
        })
    }
    </div>
     </div>
     <div onClick={this.scrollListLeft} className="thumb-list-right-btn">
     </div>
    </div>
  </div>          </div>
            )
        }
        else{
            return <div></div>
        }
    }
}
export default VideoPreview;