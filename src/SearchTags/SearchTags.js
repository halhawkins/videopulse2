import axios from "axios";
import { Component, createRef } from "react";
import settings from "../settings";
import TagField from "../TagField/TagField";
import default_pic from "../images/default-profile-icon-24.jpg";

class SearchTags extends Component {
    constructor(props){
        super(props);

        this.tagData = [];
        this.personProfileSummaryRef = createRef(null);
        this.personDataPhotoRef = createRef(null);
        this.personalDataName = createRef(null);
        this.tagfield = createRef(null);
        this.taglist = createRef(null);
        switch(this.props.tagType){
            case "crew":
                this.label = "Crew";
                break;
            case "cast":
                this.label = "Crew";
                break;
            case "keywords":
                this.label = "Keywords";
                break;
            case "genre":
                this.label = "Genres";
                break;
            default:
                this.label = "Watch Providers";
                break;
        }
        this.state = {
            tagData: []
        }
    }

    changeHandler = (e) => {
        let minlength = 3;
        if(this.props.tagType === "genres" || this.props.tagType === "providers"){
            return;
        }
        while(this.taglist.current.firstChild){
            this.taglist.current.removeChild(this.taglist.current.firstChild);
        }
        if(typeof this.props.minlength !== 'undefined')
            minlength = this.props.minlength;
        if(e.target.value.length >= minlength){
            this.getTagData(e.target.value);
        }
        
    }

    componentDidMount = () => {
        if(this.props.tagType === "genres" || this.props.tagType === "providers"){
            this.getTagData("");           
        }
    }

    getTagData = (q) => {
        let api;
        if(this.props.tagType==="cast" || this.props.tagType === "crew")
            api="names";
        else
            api=this.props.tagType;
        
        axios.get(`${settings.api_url}api/${api}?q=${q}`)
        .then(data => {
            if(this.props.tagType === "providers"){
                for(let i = 0; i < data.data.results.length; i++){
                    this.tagData.push({tmdb_id:data.data.results[i].provider_id, name: data.data.results[i].provider_name});
                }
            }
            else if(this.props.tagType==="cast"||this.props.tagType==="crew"||this.props.tagType==="keywords"){                
                for(let i = 0; i < data.data.length; i++){
                    this.tagData.push({tmdb_id:data.data[i].tmdb_id, name: data.data[i].name});
                }
            }
            else{
                this.tagData = data.data;
            }
            this.setState({
                tagData: this.tagData
            })
        })
    }

    getTags = () => {
        return this.tagfield.current.getTags();
    }

    toDataURL = (url, callback) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send(); 
      }

    onMouseOverHandler = (e) => {
        // return;
        if(this.props.tagType === "cast" || this.props.tagType === "crew"){

            let profile_path;
            let idx = this.state.tagData.findIndex(item => {
                let returnVal;
                if(item.tmdb_id.toString() === e.target.getAttribute("data-value")){
                    returnVal = item;
                }
                return returnVal;
            })
            if(idx > -1){
                let entries = this.state.tagData;
                if(typeof entries[idx].profile_path === "undefined"){
                    axios.get(`${settings.api_url}api/person/summary?tmdb_id=${this.state.tagData[idx].tmdb_id}`)
                    .then(data => {
                        // let image = "";
                        if(typeof data.data.profile_path === "undefined"){
                            profile_path = default_pic;
                        }
                        else if(data.data.profile_path === null)
                            profile_path = default_pic;
                        else{
                            profile_path = `https://image.tmdb.org/t/p/w500/${data.data.profile_path}`;
                            this.toDataURL(profile_path,res =>{
                                entries[idx].profile_path = res;
                                this.setState({
                                    tagData: entries
                                });
                            });
                        }
                        this.personalDataName.current.innerText = data.data.name;
                        if(typeof profile_path === "undefined")
                            profile_path = default_pic;
                        this.personDataPhotoRef.current.src = profile_path;        
                    });  
                }
                else{
                    if(entries[idx].profile_path !== null){
                        if(entries[idx].profile_path === "null"){
                            profile_path = default_pic;
                        }
                        else{
                            profile_path = `${entries[idx].profile_path}`;
                        }
                    }
                    else{
                        profile_path = default_pic;
                    }
                    this.personDataPhotoRef.current.src = profile_path;
                    this.personalDataName.current.innerText = entries[idx].name;
                }
            }
            this.personProfileSummaryRef.current.style.left = e.clientX+32 + "px";
            this.personProfileSummaryRef.current.style.top = e.clientY+32 + "px";
            this.personProfileSummaryRef.current.classList.remove('hide');
        }
    }

    selectTag = (e) => {
        let value = "";
        let name = "";
        if(e.target.classList.contains("tag-label")){
            value = e.target.parentElement.getAttribute("data-value");
            name = e.target.parentElement.getAttribute("data-name");
        }
        else{
            value = e.target.getAttribute("data-value");
            name = e.target.getAttribute("data-name");
        }
        e.stopPropagation();
        this.tagfield.current.addTagItem(value,name);
    }

    onMouseOutHandler = (e) => {
        if(this.props.tagType === "cast" || this.props.tagType === "crew")
        this.personProfileSummaryRef.current.classList.add("hide");
    }

    onMouseMove = (e) => {
    }
    
    render = () => {
        let dlg,input;
        if(this.props.tagType === "cast" || this.props.tagType === "crew"){
            dlg = 
                (<div ref={this.personProfileSummaryRef} id="PersonProfileSummaryRef" className="person-data-outer hide">
                <div className="person-data-container">
                    <img ref={this.personDataPhotoRef} src={default_pic} style={{height:"120px", flex: "0 0 auto"}} alt="head shot"/>
                    <div className="personal-data-column2">
                        <div ref={this.personalDataName} className="personal-data-name"></div>
                        <div className="person-data-movies" ref={this.personalDataMovies}></div>
                        <div className="person-data-movies" ref={this.personalDataTV}></div>
                    </div>
                </div>
            </div>)

        }
        else{
            dlg = <></>
        }
        if(this.props.tagType === "genres" || this.props.tagType === "providers"){
            input = <></>
        }
        else{
            input = <input ref={this.inputControl} onChange={this.changeHandler} type={this.props.tagType}/>
        }

        return(
            <div>
                <div>
                </div>

            <div style={{display:"flex",flexDirection:"column"}}>
                        
                <div className="search-tags-outer-container" >
                    <div className="search-tags-container">
                        {input}

                            <div className='tags-listing' ref={this.taglist}>{                        
                                    this.tagData.map((item,i)=>{
                                        return <div className="taglist-entry" id={item.tmdb_id} data-value={(this.props.tagType === "genres")?item.id:item.tmdb_id} onMouseOver={this.onMouseOverHandler} onMouseLeave={this.onMouseOutHandler} onClick={this.selectTag} data-name={item.name}><div className="tag-label" onClick={this.selectTag}>{item.name}</div></div>
                                    })
                                }
                            </div>
                                {dlg}

                    </div>
                    <TagField clickHandler={()=>{return}} ref={this.tagfield} tagtype={"person"} label={this.props.label} />
                </div>
            </div>
            </div>
        );
    }
}
export default SearchTags;