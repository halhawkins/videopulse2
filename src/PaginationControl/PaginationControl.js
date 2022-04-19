import { uniqueID } from "../util";
import {Component} from "react";


class PaginationControl extends Component{
    constructor(props){
        super(props);
        this.control = [];
    }

    componentDidMount = () => {
        this.calculatePages();
        this.forceUpdate();
    }

    calculatePages = () => {
        this.control = [];
        this.startPageLink = 1;
        this.endPageLink = 10;
        if(this.props.lastPage <= this.props.maxentries){
            this.startPageLink = 1;
            this.endPageLink = this.props.lastPage;
        }
        else if(this.props.currentPage <= (this.props.maxentries-Math.floor(this.props.maxentries/2))){
            this.startPageLink = 1;
            this.endPageLink = this.props.maxentries;
        }
        else if(this.props.currentPage >= this.props.lastPage-this.props.maxentries){
            this.startPageLink = this.props.lastPage-this.maxentries;
            this.endPageLink = this.props.lastPage;
        }
        else{
            this.startPageLink = this.props.currentPage - Math.floor(this.props.maxentries/2);
            this.endPageLink = this.startPageLink + this.props.maxentries;
        }
        for(let i = this.startPageLink; i <= this.endPageLink; i++){
            let linkClass = "pagination-link";
            if(i === parseInt(this.props.currentPage,10))
                linkClass = "pagination-link selected-page";
            this.control.push(<a key={uniqueID()} href={this.props.link+i} ><div className={linkClass}>{i}</div></a>);
        }
    }

    render = () => {  
        if(this.control.length === 0)
            return <></>
        else
            return <div className="pagination-links">{this.control}</div>
    }
}
export default PaginationControl;