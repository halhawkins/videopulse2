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
            lists: []
        }
    }

    componentDidMount = () => {
        console.log("about to get lists MediaSummary 33 " + uniqueID())
        // apiClient.get('api/lists')
        // .then(listsData => {
        //     this.listHtml = listsData.data.map((list,i) => {
        //         return(
        //             <li key={`listlistli-${i}`}>{this.isInList(list.id,list.items)?list.list_name==='Favorites'&&list.systemList===1?<div key={`listlistdiv1-${i}`} data-listid={list.id} onClick={this.removeFromList} className="heart-remove" title="Remove from Favorites"></div>:<div key={`listlistdiv2-${i}`} data-listid={list.id} onClick={this.removeFromList} className="green-check-mark" title="Remove from list" alt="remove from list"></div>:list.list_name==='Favorites'&&list.systemList===1?<div key={`listlistdiv3-${i}`} data-listid={list.id} onClick={this.addToList} className="heart-add" title="Add to Favorites"></div>:<div key={`listlistdiv4-${i}`} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}<a key={`listlista1-${i}`} href={`?page=list&list_id=${list.id}`}>{list.list_name}</a></li>
        //         )
        //     });
            
            this.setState({
                title: this.props.media_name,
                // lists: listsData.data
            });
        // });
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
            console.log("about to get lists MediaSummary 73 " + uniqueID())
            apiClient.get('api/lists')
            .then(data => {
                this.listHtml = data.data.map((list,i) => {
                    return(
                        <li key={`li2-listlist-${i}`}>{this.isInList(list.id,list.items)?<div key={`div4-listlist-${i}`} className="green-check-mark" title="Remove from list" alt="remove from list"></div>:<div key={`div5-listlist-${i}`} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}{list.list_name}</li>
                    )
                });
                this.forceUpdate();
                this.setState({
                    lists: data.data
                })
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
            console.log("about to get lists MediaSummary 100 " + uniqueID())
            apiClient.get('api/lists')
            .then(data => {
                this.listHtml = data.data.map((list,i) => {
                    return(
                        <li key={`li-listlist-${i}`}>{this.isInList(list.id,list.items)?list.list_name==='Favorites'&&list.systemList===1?<div key={`li-listlist-${i}`} data-listid={list.id} onClick={this.removeFromList} className="heart-remove" title="Remove from Favorites"></div>:<div key={`div1-listlist-${i}`} data-listid={list.id} onClick={this.removeFromList} className="green-check-mark" title="Remove from list" alt="remove from list"></div>:list.list_name==='Favorites'&&list.systemList===1?<div key={`div2-listlist-${i}`} data-listid={list.id} onClick={this.addToList} className="heart-add" title="Add to Favorites"></div>:<div key={`div3-listlist-${i}`} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}{list.list_name}</li>
                        )
                });
                this.setState({
                    lists: data.data
                })
            })
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
            console.log("about to get lists MediaSummary 122" + uniqueID())
            apiClient.get('api/lists')
            .then(data => {
                this.listHtml = data.data.map((list,i) => {
                    return(
                        <li key={`listli1-${i}`}>{this.isInList(list.id,list.items)?list.list_name==='Favorites'&&list.systemList===1?<div key={`listdiv11-${i}`} data-listid={list.id} onClick={this.removeFromList} className="heart-remove" title="Remove from Favorites"></div>:<div key={`listdiv12-${i}`} data-listid={list.id} onClick={this.removeFromList} className="green-check-mark" title="Remove from list" alt="remove from list"></div>:list.list_name==='Favorites'&&list.systemList===1?<div key={`listdiv13-${i}`} data-listid={list.id} onClick={this.addToList} className="heart-add" title="Add to Favorites"></div>:<div key={`listdiv14-${i}`} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}<a key={`lista1-${i}`} href={`?page=list&list_id=${list.id}`}>{list.list_name}</a></li>
                        )
                });
                this.setState({
                    lists: data.data
                })
            })
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
        if(isLoggedIn()){
            addToListButton = <div onClick={this.handleManageListsButton} className="add-to-list-button" title="Add to list">+</div>
        }
        if(this.state.addToList){
            addToListDialog = <ListDialog poster_path={this.props.poster_path} media_name={this.props.media_name} closeDlg={this.closeAddToListDlg} mediaID={this.props.mediaID} mediaType={this.props.mediaType}/>
        }
        else{
            addToListDialog = <></>
        }

        let sizeClass = "summary-normal-size";
        let poster_path;
        if(this.props.mediaType === 'episode')
            poster_path = this.props.poster_path === null?default_poster:`${settings.backdrop_base}${this.props.poster_path}`;
        else
            poster_path = this.props.poster_path === null?default_poster:`${settings.poster_base}${this.props.poster_path}`;
        if(this.props.overview === "")
            return <></>
        else
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