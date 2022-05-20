import { Component, createRef } from "react";
import apiClient from "../api";
import default_poster from "../images/poster-placeholder.jpg";
import { isLoggedIn, uniqueID } from "../util";
import "../chars.css";
import ListDialog from "../ListDialog/ListDialog";
import settings from "../settings";

class MediaSummary extends Component{

    constructor(props) {
        super(props);
        this.mediaID = props.mediaID;
        this.mediaType = props.mediaType;
        this.pointer = createRef(null);
        this.newListName = createRef(null);
        this.newListCheck = createRef(null);
        this.newListCancel = createRef(null);
        this.newListButton = createRef(null);

        this.state = {
            title: "",
            posterURL: "",
            year: "",
            overview: "",
            rating: 0.0,
            addToList: false,
            lists: this.props.lists
        }
    }

    componentDidMount = () => {
        this.setState({
            title: this.props.media_name,
        });
    }

    clickHandler = (mediaID, mediaType) => {
        this.props.passThru(mediaID,mediaType);
    }

    goToDetails = (e) => {
        let episode = '', season = '';
        if(this.props.mediaType === 'episode'){
            episode = `&episode=${this.props.episode}`;
            season = `&season=$${this.props.season}`;
        }
        window.location = `?page=details&itemID=${this.props.mediaID}&itemType=${this.props.mediaType}${season}${episode}`;
    }

    handleManageListsButton = (e) => {
        this.setState({
            addToList: true
        });
    }

    getTile = () => {
    }

    submitNewList = () => {
        apiClient.post('api/list',{list_name: this.newListName.current.value, public: true,show_list_owner: true})
        .then(()=>{
            this.listHtml = this.props.lists.map(list => {
                return(
                    <li key={uniqueID()}>{this.isInList(list.id, list.items)?<div key={uniqueID()} className="green-check-mark" title="Remove from list"></div>:<div key={uniqueID()} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}{list.list_name}</li>
                )
            })
            this.forceUpdate();
            this.setState({
                lists: this.props.lists
            })
        });
    }

    addToList = (e) => {
        let listID = e.target.getAttribute('data-listid')
        apiClient.post('api/listitem',{
            list_id: listID,
            item_title: this.props.media_name,
            item_id: this.props.mediaID,
            item_type: this.props.mediaType,
            poster_path: this.props.poster_path
        })

        .then(()=>{
            this.props.updateLists();
        })
    }

    removeFromList = (e) => {
        let listID = e.target.getAttribute("data-listid");
        
        apiClient.post('api/dellistitem',{
            list_id: listID,
            item_id: this.props.mediaID,
            item_type: this.props.mediaType
        })
        .then(()=>{
            this.props.updateLists();
            this.forceUpdate();  
        })
    }

    isInList = (listID, itemsArray) =>{
        for(let i = 0; i < itemsArray.length;i++){
            if(
                itemsArray[i].item_id.toString() === this.props.mediaID.toString() && 
                itemsArray[i].item_type.toString() === this.props.mediaType.toString() && 
                itemsArray[i].list_id.toString() === listID.toString()){
                return true
            }
        }
        return false;
    }

    closeAddToListDlg = () => {
        this.setState({
            addToList: false
        })
    }

    newListButtonHandler = () => {
        this.newListButton.current.classList.add("hidden-field");
        this.newListName.current.classList.remove("hidden-field");
        this.newListCheck.current.classList.remove("hidden-field");
        this.newListCancel.current.classList.remove("hidden-field");
    }

    cancelNewListButtonHandler = () => {
        this.newListButton.current.classList.remove("hidden-field");
        this.newListName.current.classList.add("hidden-field");
        this.newListCheck.current.classList.add("hidden-field");
        this.newListCancel.current.classList.add("hidden-field");
    }

    render = () => {
        let addToListDialog,addToListButton;
        let overview = this.props.overview === ""?"":this.props.overview;
        if(isLoggedIn()){
            if(typeof this.props.listItem !== "undefined"){
                addToListButton = <div data-listid={this.props.listItem} onClick={this.removeFromList} className="add-to-list-button" title="Remove from list">x</div>
            }
            else{
                addToListButton = <div onClick={this.handleManageListsButton} className="add-to-list-button" title="Add to list">+</div>
            }
        }
        if(this.state.addToList){
            addToListDialog = <ListDialog poster_path={this.props.poster_path} media_name={this.props.media_name} closeDlg={this.closeAddToListDlg} mediaID={this.props.mediaID} mediaType={this.props.mediaType}/>
        }
        else{
            addToListDialog = <></>
        }

        let poster_path;
        if(this.props.mediaType === 'episode')
            poster_path = this.props.poster_path === null?default_poster:`${settings.backdrop_base}${this.props.poster_path}`;
        else{
            poster_path = this.props.poster_path === null?default_poster:this.props.mediaType === 'person'?`${settings.profile_base}${this.props.poster_path}`:`${settings.sm_poster_base}${this.props.poster_path}`;
        }
        return(
            <div className="tvmovieitem" >
                {addToListDialog}
                {addToListButton}
                    <div onClick={this.goToDetails} className="poster-div">
                        <img onClick={this.goToDetails} alt="poster" src={poster_path}/>
                    </div>
                    <div onClick={this.goToDetails} className="tvmovieitem-desc">
                        <h3 onClick={this.goToDetails}>{this.props.media_name}</h3><br />
                        <em onClick={this.goToDetails}>{this.props.mediaType === 'tv'?"Series":this.props.mediaType}</em><p>
                        {typeof this.props.overview !== 'undefined'?this.props.overview.length>80?this.props.overview.substr(0,80)+"...":this.props.overview:""}</p>
                    </div>
            </div>
        );
    }
}
export default MediaSummary;