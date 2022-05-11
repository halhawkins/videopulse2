import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component, createRef } from "react";
// import fontawesome from '@fortawesome/fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";

class SearchBar extends Component{
    constructor(props){
        super(props);
        this.searchForm = createRef(null);
        // fontawesome.library.add(faMagnifyingGlass);
    }

    submitSearch = (e) => {
        this.searchForm.current.submit();
    }

    render(){
        return(
            <form action="?page=search" method="get" ref={this.searchForm}>
                <div className="sb-box">
                    <input name="q" id="searchinput" type="text" className="search-input" placeholder="Search for movies and TV" />
                    <input type="hidden" name="page" value="search" />
                    <input type="hidden" name="p" value="1" />
                    <a onClick={this.submitSearch} className="search-btn" href="#" value="submit" role="button">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </a>
                </div>
            </form>
        );
    }
}
export default SearchBar;