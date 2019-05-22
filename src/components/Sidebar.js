import React, { Component } from 'react';

class Sidebar extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    return (
    <div id="sidebar">
        <input placeholder="Filter by" value={this.props.query} onChange={(e) => { this.props.filterVenues(e.target.value) }} />
        <br/>
        <br/>

        {
          this.props.filterVenues && this.props.filterVenues.length > 0 && this.props.filterVenues.map((venue, index) => (
            <div className="venue-item" key={index} onClick={() => { this.props.listItemClick(venue) }}>
              { venue.name }
            </div>
          ))
        }

      </div>
    );
  }
}

export default Sidebar;
