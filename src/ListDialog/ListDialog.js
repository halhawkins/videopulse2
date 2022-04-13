import {Component, createRef } from "react";
import apiClient from "../api";

class ListDialog extends Component{
    constructor(props){
        super(props);
        this.newListName = createRef(null);
        this.newListCheck = createRef(null);
        this.newListCancel = createRef(null);
        this.newListButton = createRef(null);
        this.listHtml = [];

        this.state = {
            title: "",
            lists: []
        }
    }
    
    componentDidMount = () => {
        apiClient.get('api/lists')
        .then(listsData => {
            this.listHtml = listsData.data.map((list,i) => {
                return(
                    <li key={`listlistli-${i}`}>{this.isInList(list.id,list.items)?list.list_name==='Favorites'&&list.systemList===1?<div key={`listlistdiv1-${i}`} data-listid={list.id} onClick={this.removeFromList} className="heart-remove" title="Remove from Favorites"></div>:<div key={`listlistdiv2-${i}`} data-listid={list.id} onClick={this.removeFromList} className="green-check-mark" title="Remove from list" alt="remove from list"></div>:list.list_name==='Favorites'&&list.systemList===1?<div key={`listlistdiv3-${i}`} data-listid={list.id} onClick={this.addToList} className="heart-add" title="Add to Favorites"></div>:<div key={`listlistdiv4-${i}`} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}<a key={`listlista1-${i}`} href={`?page=list&list_id=${list.id}`}>{list.list_name}</a></li>
                )
            });
            
            this.setState({
                title: this.props.media_name,
                lists: listsData.data
            });
        });
    }

    isInList = (listID, itemsArray) =>{
        if(typeof itemsArray !== 'undefined'){
            for(let i = 0; i < itemsArray.length;i++){
                if(
                    itemsArray[i].item_id.toString() === this.props.mediaID.toString() && 
                    itemsArray[i].item_type.toString() === this.props.mediaType.toString() && 
                    itemsArray[i].list_id.toString() === listID.toString())
                    {
                        return true
                    }
            }
        }
        return false;
    }

    closeAddToListDlg = () => {
        this.props.closeDlg();
    }

    submitNewList = () => {
        apiClient.post('api/list',{list_name: this.newListName.current.value, public: true,show_list_owner: true})
        .then(()=>{
            apiClient.get('api/lists')
            .then(data => {
                this.listHtml = data.data.map((list,i) => {
                    return(
                        <li key={`li2-listlist-${i}`}>{this.isInList(list.id,list.items)?<div key={`div4-listlist-${i}`} className="green-check-mark" title="Remove from list" alt="remove from list"></div>:<div key={`div5-listlist-${i}`} data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}{list.list_name}</li>
                    )
                });
                this.forceUpdate();
                this.newListName.current.value = "";
                this.setState({
                    lists: data.data
                })
            })
        });
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

    removeFromList = (e) => {
        let listID = e.target.getAttribute("data-listid");
        
        apiClient.post('api/dellistitem',{
            list_id: listID,
            item_id: this.props.mediaID,
            item_type: this.props.mediaType
        })
        .then(()=>{
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

    addToList = (e) => {
        let listID = e.target.getAttribute('data-listid')

        apiClient.post('api/listitem',{
            list_id: listID,
            item_title: this.props.media_name,
            item_id: this.props.mediaID,
            item_type: this.props.mediaType,
            poster_path: this.props.poster_path,
            episode: this.props.episode,
            season: this.props.season
        })

        .then(()=>{
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

    render = () => {
        return(
            <div className="modal-screen">
                <div className="dialog">
                    <div className="dlg-title">Manage lists</div>
                    <div className="dlg-content">
                        <ul className="dlg-list">
                            {this.listHtml}
                        </ul>
                            <div className="dlg-input" style={{textAlign: "center"}}>
                                <input ref={this.newListName} type="text" className="hidden-field" />
                                <div onClick={this.submitNewList} ref={this.newListCheck} className="hidden-field check-sign" title="Submit"></div>
                                <div onClick={this.cancelNewListButtonHandler} ref={this.newListCancel} className="hidden-field cancel-sign" title="Cancel"></div>
                                <div onClick={this.newListButtonHandler} ref={this.newListButton} className="videopulse-button">Create new list</div>
                            </div>
                            <p></p>
                        <div tabIndex={"3"} className="videopulse-button" style={{float:"right"}} onClick={this.closeAddToListDlg}>Close</div>
                    </div>
                </div>
            </div>

        )
    }
}
export default ListDialog;