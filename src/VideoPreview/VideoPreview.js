import { Component,createRef } from "react";

class VideoPreview extends Component{
    constructor(props){
        super(props);
        this.thumbRef = [];
        this.thumbList = createRef(null);
        this.thumblistRef = createRef(null);
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
        if(this.scrollPosition <= 0){
            this.scrollPosition = 0;
        }
        let scrollDistance = 126;
        this.scrollPosition -= scrollDistance;
        if(this.scrollPosition >= document.getElementById("thumblist").lastChild.offsetLeft)
            this.scrollPosition = this.thumbList.current.offsetWidth-scrollDistance;
        document.getElementById("thumblist").style.left = -(this.scrollPosition)+"px";
    }

    scrollListRight = (e) => {
        let lastChildPos = document.getElementById("thumblist").lastChild.offsetLeft - this.scrollPosition;
        let scrollDistance = 126;
        if(lastChildPos <= this.thumbList.current.offsetWidth - 126)
            this.scrollPosition = this.thumbList.current.offsetWidth - 126;
        this.scrollPosition += scrollDistance;
        if(this.scrollPosition <= 0)
            this.scrollPosition = 0;
            
        document.getElementById("thumblist").style.left = -(this.scrollPosition)+"px";
    }

    render = () => {
        if(this.props.videos !== null){
            return ( 
            <div className="video-preview-component">
  <div className="video-section">
    <div className="video-player">
      <iframe allowFullScreen={true} title="ytplayer" frameBorder="0" src={"https://www.youtube.com/embed/" + this.props.videos[this.state.selected].id}></iframe>
    </div>
    <div className="video-selector">
     <div onClick={this.scrollListRight} className="thumb-list-left-btn"><div>◀</div>
     </div>
     <div className="thumb-list-container" ref={this.thumbList}>
     <div ref={this.thumblistRef} id="thumblist" className="thumb-list">
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
     <div onClick={this.scrollListLeft} className="thumb-list-right-btn"><div>▶</div>
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