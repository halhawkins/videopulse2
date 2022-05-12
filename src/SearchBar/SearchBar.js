import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component, createRef } from "react";
// import fontawesome from '@fortawesome/fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";
import { supportsHover } from "../util";

class SearchBar extends Component{
    constructor(props){
        super(props);
        this.searchForm = createRef(null);
        this.sbBoxRef = createRef(null);
        this.state = {
            supportsHover: supportsHover(),
            expandedSB: false
        };
        // fontawesome.library.add(faMagnifyingGlass);
    }

    expandSearchBox = (e) => {
        if(!this.state.supportsHover){
            this.setState({
                expandedSB: true
            });
        }
    }

    contractSearchBox = (e) => {
        if(!this.state.supportsHover){
            this.setState({
                expandedSB: false
            });
        }
    }

    handleClick = (e) => {
        let v = document.getElementById("searchinput");
        if(!this.state.supportsHover){
            if(this.state.expandedSB && v.value.length > 0){
                this.searchForm.current.submit();
            }
            else if(!this.state.expandedSB){
                this.expandSearchBox(e);
                this.setState({
                    expandedSB: true
                })
            }
        }
        else
            this.searchForm.current.submit();
    } 

    render(){
        return(
            <form action="?page=search" method="get" ref={this.searchForm}>
                <div className="sb-box" ref={this.sbBoxRef}>
                    <input name="q" id="searchinput" type="text" className="search-input" placeholder="Search for movies and TV" />
                    <input type="hidden" name="page" value="search" />
                    <input type="hidden" name="p" value="1" />
                    <a onClick={this.handleClick} className="search-btn" href="#" value="submit" role="button">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </a>
                </div>
            </form>
        );
    }
}
export default SearchBar;