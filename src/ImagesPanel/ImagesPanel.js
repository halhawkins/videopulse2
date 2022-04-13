import {Component, createRef} from "react";
import settings from "../settings";
import keyLeft from "../images/A-key.png";
import keyRight from "../images/D-key.png";
import "./carousel.css";

class ImagesPanel extends Component{
    constructor(props){
        super(props);

        this.thumbContainer = createRef(null);
        this.thumbRefs = [];
        this.left = 0;
        this.selectedRef = createRef(null);
        this.carouselContainer = createRef(null);
        this.keysTip = createRef(null);

        this.state = {
            selectedImage: 0
        }
    }

    componentDidMount = () => {
        this.carouselContainer.current.addEventListener("keypress",this.navkeys,null);
        this.carouselContainer.current.focus();
    }

    navleft = () => {
        let index = this.state.selectedImage;
        if(typeof this.props.images !== 'undefined'){
            if(this.props.images.length === 0){
                index = 0;
            }
            else{
                if(this.state.selectedImage === 0){
                    index = this.props.images.length-1;
                }
                else{
                    index = this.state.selectedImage-1;
                }
            }
        }
        this.showTip()
        this.setState({
            selectedImage: index
        });
    }

    navright = () => {
        let index = this.state.selectedImage;
        if(typeof this.props.images !== 'undefined'){
            if(this.props.images.length === 0){
                index = 0;
            }
            else{
                if(this.state.selectedImage === this.props.images.length-1){
                    index = 0;
                }
                else{
                    index = this.state.selectedImage + 1;
                }
            }
        }
        this.setState({
            selectedImage: index
        });
    }

    navkeys = (e) => {
        if(
            e.key === "ArrowLeft" || 
            e.key === "ArrowRight"||
            e.key === "a" ||
            e.key === "A" ||
            e.key === "d" ||
            e.key === "D"){
            if(e.key === "a" || e.key === "A" || e.key === "ArrowLeft"){
                this.navleft();
            }
            else{
                this.navright();
            }
        }
    }

    showTip = () => {
        this.carouselContainer.current.focus();
        this.keysTip.current.classList.add("showTip");
        setTimeout(() => {
            if(this.keysTip.current !== null)
                this.keysTip.current.classList.remove("showTip");
        } , 5000);
    }

    render = () => {
        let images;
        let style;
        let imageCounter = `${this.state.selectedImage+1}/${this.props.images.length}`;
        let verticalPos = {};
        if(typeof this.props.images !== "undefined"){
            images = this.props.images.map((item,i)=>{  
                if(this.state.selectedImage === i){
                    style = {
                        display: "block",
                        animation: `{from {right:"${item.width}px"},to:"0";}`,
                    }
                }
                else{
                    style = {
                        display: "none",
                    }
                }
                return (
                        <div className="image">
                            <img src={settings.backdrop_base+item.file_path} style={style} alt="" />
                        </div>
                );
            });
        }
        return(
            <div className="image-panel">
                <section>
                    <div onMouseMove={this.showTip} tabindex="0" ref={this.carouselContainer} className="carousel-container-80">{images}
                    </div>
                    <div onClick={this.navleft} className="carousel-nav navleft">&#10094;</div>
                    <div onClick={this.navright} className="carousel-nav navright">&#10095;</div>
                    <div className="image-counter">{imageCounter}</div>
                </section>    
                    <div ref={this.keysTip} style={{alignSelf: "center"}} className="keys-hint">&#129152;<img src={keyLeft} alt="" />&nbsp;&nbsp;<img src={keyRight} alt="" />&#129154;</div>
            </div>
        );
    }
}
export default ImagesPanel;