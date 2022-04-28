import { Component } from "react";
import apiClient from "../api";
import settings from "../settings";
import { uniqueID } from "../util";

class ListsComponent extends Component{
    constructor(props){
        super(props);
        this.listPosters = [];
        this.state = {
            lists: this.props.lists,
            showDeleteBox: false,
            deleteListID: null,
            deleteListName: ""
        }
    }

    componentDidUpdate = (oldProps) => {
        if(oldProps.lists !== this.props.lists){
            this.setState({
                lists: this.props.lists
            });
        }
    }
    componentDidMount = () =>{
        this.setState({
            showDeleteBox: false
        });
    }

    deleteListHandler = (e) => {
        e.stopPropagation();

        let listID = parseInt(e.target.getAttribute("data-list-id"));
        let listName = e.target.getAttribute("data-list-name");

        this.setState({
            deleteListName: listName,
            deleteListID: listID,
            showDeleteBox: true
        })
        this.forceUpdate();
    }

    deleteList = (id) => {
        let idx = this.state.lists.findIndex(obj => {
            return obj.id === this.state.deleteListID;
        })
        this.state.lists.splice(idx,1);
        apiClient.post(`${settings.api_url}api/list/delete/${this.state.deleteListID}`)
        .then(data => {
            this.setState({
                showDeleteBox: false
            });
        })
        this.forceUpdate();
    }

    cancelDeleteList = (e) => {
        this.setState({
            showDeleteBox: false
        });
        this.forceUpdate();
    }

    showList = (e) => {
        window.location = `?page=list&list_id=${e.target.getAttribute('data-list-id')}&list_name=${e.target.getAttribute('data-list-name')}`;
    }

    render = () => {
        const dlg = <div className="modal-screen">
            <div className="dialog"><div className="dlg-title">Delete list</div><div className="dlg-content"><p>Perminantly delete the list &quot;{this.state.deleteListName}&quot;?</p><div tabIndex={"3"} className="videopulse-button" style={{float:"right", margin:".3em"}} onClick={this.cancelDeleteList}>Cancel</div><div onClick={this.deleteList} className="videopulse-button" style={{float:"right", margin:".3em"}}>Ok</div></div></div>
        </div>
        return <>
            {this.state.showDeleteBox?dlg:<></>}
            <div className="content-title"><h2 className="page-title">Your Lists</h2></div>
            {this.props.lists.map(list => {
                return(
                    <div key={uniqueID()} className="tvmovielistitem" data-list-name={list.list_name} data-list-id={list.id} onClick={this.showList}>
                        <div className="img-group-container" data-list-name={list.list_name} data-list-id={list.id}>
                            <div data-list-name={list.list_name} data-list-id={list.id} className="img-group-item" style={{backgroundImage: `url(${settings.sm_poster_base}${typeof list.items[0] !== "undefined"?list.items[0].poster_path:""})`}}></div>
                            <div data-list-name={list.list_name} data-list-id={list.id} className="img-group-item" style={{backgroundImage: `url(${settings.sm_poster_base}${typeof list.items[1] !== "undefined"?list.items[1].poster_path:""})`}}>
                                <div className="list-delete-button" data-list-name={list.list_name} data-list-id={list.id} onClick={this.deleteListHandler}><span data-list-name={list.list_name} data-list-id={list.id}>&#x2715;</span></div>
                            </div>
                            <div data-list-name={list.list_name} data-list-id={list.id} className="img-group-item" style={{backgroundImage: `url(${settings.sm_poster_base}${typeof list.items[2] !== "undefined"?list.items[2].poster_path:""})`}}></div>
                            <div data-list-name={list.list_name} data-list-id={list.id} className="img-group-item" style={{backgroundImage: `url(${settings.sm_poster_base}${typeof list.items[3] !== "undefined"?list.items[3].poster_path:""})`}}>
                                {list.items.length > 4?<div data-list-id={list.id} className="item-count">+{list.items.length-4}</div>:<></>}
                            </div>
                            
                            <div data-list-name={list.list_name} data-list-id={list.id} className="tvmovielistitem-desc">
                                <em data-list-name={list.list_name} data-list-id={list.id}>List</em><br/>
                                <h3 data-list-name={list.list_name} data-list-id={list.id}>{list.list_name}</h3>
                            </div>
                        </div>
                    </div>
                );
                
            })}
        </>
    }
}
export default ListsComponent; 