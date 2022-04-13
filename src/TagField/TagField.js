import axios from "axios";
import { Component, createRef } from "react";
import defaultHeadShot from "../images/default-profile-icon-24.jpg";
import settings from "../settings";
class TagField extends Component {
    constructor(props){
        super(props);

        this.personDataPhotoRef = createRef(null);
        this.personProfileSummaryRef = createRef(null);
        this.profileVisible = false;
        this.currentProfile = null;
        this.personalDataName = createRef(null);
        this.personalDataMovies = createRef(null);
        this.personalDataTV = createRef(null);
        this.hoverData = [];
        this.debug = createRef(null);
        this.state = {
            tags: [],
            currentName: ""
        }
    }

    addTagItem = (value,name) => {
        if(value===null)
            return; 
        for(let i = 0; i < this.state.tags.length; i++){
            if(this.state.tags[i].value === value)
                return;
        }
        let newTag = {value:value, name:name};
        let temp = this.state.tags;
        temp.push(newTag);

        let hoverData = {};

        let hoverDataIndex = this.hoverData.findIndex(item => {
            let retval = null;
            if(parseInt(item.value,10) ===  parseInt(value,10)){
                retval = item;
            }   
            return retval;
        })
        
        if(this.props.tagtype === "person"){
            if(hoverDataIndex === -1){
                let tv = "";
                let movies = "";
                axios(`${settings.api_url}api/person/summary?tmdb_id=${value}`)
                .then(data => {
                    let res = data.data;

                    hoverData.value = value;
                    hoverData.name = res.name;
                    if(res.profile_path !== null)
                        hoverData.photo = `${settings.poster_base}${res.profile_path}`;
                    else
                        hoverData.photo = defaultHeadShot;
                    if(res.tv_credits.cast !== null){
                        if(res.tv_credits.cast.length > 0){
                            if(res.tv_credits.cast.length > 1){
                                tv = `TV: <em>${res.tv_credits.cast[0].name}, ${res.tv_credits.cast[1].name} ...</em>`;
                            }
                            else{
                                tv = `TV: <em>${res.tv_credits.cast[0].name}</em>`;
                            }
                        }
                        else{
                            tv = "";
                        }
                        hoverData.tv = tv;
                    }
                    if(res.movie_credits !== null){
                        if(res.movie_credits.cast.length > 0){
                            if(res.movie_credits.cast.length > 1){
                                movies = `Movies: <em>${res.movie_credits.cast[0].title}, ${res.movie_credits.cast[1].title} ...</em>`;
                            }
                            else{
                                movies = `Movies: <em>${res.movie_credits.cast[0].title}</em>`;
                            }
                        }
                        else{
                            movies = "";
                        }
                        hoverData.movies = movies;
                    }

                    this.hoverData.push(hoverData);
                    if(this.profileVisible)
                        this.showPersonProfile(value);
                })
            }
        }
        this.setState({
            tags: temp
        });
    }


    getTags = () => {
        return this.state.tags;
    }

    removeTagItem = (value,e) => {
        e.stopPropagation();
        let temp = [];
        for(let i = 0; i < this.state.tags.length; i++){
            if(parseInt(this.state.tags[i].value,10) !== parseInt(value,10)){
                temp.push(this.state.tags[i]);
            }
        }

        let removeDataIndex = this.hoverData.findIndex(item => {
            let retval = null;
            if(parseInt(item.value,10) ===  parseInt(value,10)){
                retval = item;
            }   
            return retval;
        })
        this.hidePersonProfile();

        this.hoverData.splice(removeDataIndex,1)
        this.currentProfile = null;
        this.setState({
            tags: temp
        });
    }

    hoverHandler = (e) => {
        this.showPersonProfile(e.target.getAttribute("data-value"))
        this.personProfileSummaryRef.current.style.left = (parseInt(e.pageX,10)+32) + "px";
        this.personProfileSummaryRef.current.style.top = (parseInt(e.pageY,10)+32) + "px"; 
    }

    // componentWillUnmount = () => {
    //     this.hidePersonProfile();
    // }

    showPersonProfile = (value) => {
        let hoverData = {}; 
        this.currentProfile = value;

        let hoverDataIndex = this.hoverData.findIndex(item => {
            let retval = null;
            if(parseInt(item.value,10) === parseInt(value,10)){
                retval = item;
            } 
            return retval; 
        })

        if(hoverDataIndex === -1){
            
            this.personalDataName.current.innerText = "";
            this.personDataPhotoRef.current.setAttribute("src",defaultHeadShot);
            this.personalDataTV.current.innerHTML = "";
            this.personalDataMovies.current.innerHTML = "";

            this.currentProfile = value;
            this.personProfileSummaryRef.current.style.display = "inline-block";
            this.personDataPhotoRef.current.setAttribute("src",defaultHeadShot);
            this.profileVisible = true;
        }
        else{
            hoverData = {
                value: value, 
                photo: this.hoverData[hoverDataIndex].photo, 
                name: this.hoverData[hoverDataIndex].name,
                tv:this.hoverData[hoverDataIndex].tv,
                movies: this.hoverData[hoverDataIndex].movies
            }
            this.personalDataName.current.innerText = hoverData.name;
            this.personDataPhotoRef.current.setAttribute("src",hoverData.photo);
            this.personalDataTV.current.innerHTML = hoverData.tv;
            this.personalDataMovies.current.innerHTML = hoverData.movies;
            this.personProfileSummaryRef.current.style.display = "inline-block";
            this.profileVisible = true;
        }
    }

    movePersonProfile = (e) => {
        let hoverDataIndex = [];
        if(this.props.tagtype === "person"){
            hoverDataIndex = this.hoverData.findIndex(item => {
                let retval = null;
                if(parseInt(item.value,10) === parseInt(e.target.getAttribute("data-value"),10)){
                    retval = item;
                }   
                return retval;
            })
            if(typeof(this.hoverData[hoverDataIndex])!=='undefined'){
                this.currentProfile = hoverDataIndex;
                this.personalDataName.current.innerText = this.hoverData[hoverDataIndex].name;
                this.personDataPhotoRef.current.setAttribute("src",this.hoverData[hoverDataIndex].photo);
                this.personalDataTV.current.innerHTML = this.hoverData[hoverDataIndex].tv;
                this.personalDataMovies.current.innerHTML = this.hoverData[hoverDataIndex].movies;

                if(this.profileVisible){
                    this.personProfileSummaryRef.current.style.left = (parseInt(e.pageX,10)+32) + "px";
                    this.personProfileSummaryRef.current.style.top = (parseInt(e.pageY,10)+32) + "px"; 
                }
            }
        }
    }

    hidePersonProfile = (e) => {
        if(this.profileVisible){
            this.personProfileSummaryRef.current.style.display = null;
            this.profileVisible = false;
        }
    }

    clickHandler = (val,e) => {
        if(this.props.clickHandler !== null)
            this.props.clickHandler(e)
    }

    render = () => {
        const k = (Math.random()*10000).toFixed().toString();

        if(this.props.tagtype === 'person'){
            return (
            <div onClick={this.clickHandler} className="tag-field-container">
                <div className="tag-field-label">{this.props.label}</div>
                <div className="tag-field-div">
                {
                    this.state.tags.map((item,i) => {
                        return <div key={"cast"+k+"-"+i} data-value={item.value} onMouseLeave={null/*this.hidePersonProfile*/} onMouseMove={null/*this.movePersonProfile*/} onMouseOver={null/*this.hoverHandler*/} className="tag-container"><div className="tag-field-tag" data-value={item.value}>{item.name}</div><div onClick={(e) => this.removeTagItem(item.value,e)} data-value={item.value} className="remove-tag-button">X</div></div>
                    })
                }
                </div>
                <div ref={this.debug}></div>
                </div>
            )
        }
        else if(this.props.tagtype === 'keywords'){
            return (
            <div onClick={this.props.clickHandler} className="tag-field-container">
                <div className="tag-field-label">{this.props.label}</div>
                <div className="tag-field-div">
                {
                    this.state.tags.map((item,i) => {
                        return <div key={"keywordstag"+k+"-"+i} data-value={item.value} className="tag-container"><div className="tag-field-tag" data-value={item.value}>{item.name}</div><div key={"keywordsclose"+k+"-"+i} onClick={(e) => this.removeTagItem(item.value,e)} data-value={item.value} className="remove-tag-button">X</div></div>
                    })
                }
                </div>
                </div>
            )
        }    
        else if(this.props.tagtype === 'genres'){
            return (
            <div onClick={this.props.clickHandler} className="tag-field-container">
                <div className="tag-field-label">{this.props.label}</div>
                <div className="tag-field-div">
                {
                    this.state.tags.map((item,i) => {
                        return <div key={"genrestag"+k+"-"+i} data-value={item.value} className="tag-container"><div key={"genrestagclose"+k+"-"+i} className="tag-field-tag" data-value={item.value}>{item.name}</div><div onClick={(e) => this.removeTagItem(item.value,e)} data-value={item.value} className="remove-tag-button">X</div></div>
                    })
                }
                </div>
                <div ref={this.debug}></div>
                </div>
            )
        }
        else if(this.props.tagtype === 'providers'){
            return (
            <div onClick={this.props.clickHandler} className="tag-field-container">
                <div className="tag-field-label">{this.props.label}</div>
                <div className="tag-field-div">
                {
                    this.state.tags.map((item,i) => {
                        return <div key={"providerstagdiv" + k+"-"+i} data-value={item.value} className="tag-container"><div key={"providerstag" + k+"-"+i} className="tag-field-tag" data-value={item.value}>{item.name}</div><div key={"providerstagclose" + k+"-"+i} onClick={(e) => this.removeTagItem(item.value,e)} data-value={item.value} className="remove-tag-button">X</div></div>
                    })
                }
                </div>
                <div ref={this.debug}></div>
                </div>
            )
        }
    }
}
export default TagField;