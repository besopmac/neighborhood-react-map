import React, { Component } from 'react';
import logo from './assets/logo-foursquare.png';
import './App.css';

import { load_google_maps, load_places } from './utils';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    let googleMapsPromise = load_google_maps();
    let placesPromise = load_places();

    Promise.all([
      googleMapsPromise,
      placesPromise
    ])
    .then(values => {
      let google = values[0];
      this.venues = values[1].response.venues;

      this.google = google;
      this.markers = [];
      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        scrollwheel: true,
        center: { lat: this.venues[0].location.lat, lng: this.venues[0].location.lng }
      }); 

      this.venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
          else { marker.setAnimation(google.maps.Animation.BOUNCE); }
          setTimeout(() => { marker.setAnimation(null) }, 2000);
        });

        google.maps.event.addListener(marker, 'click', () => {
          this.infowindow.setContent(marker.name);
          this.map.setZoom(13);
          this.map.setCenter(marker.position);
          this.infowindow.open(this.map, marker);
          this.map.panBy(0, -125);
        });
        
        this.markers.push(marker);
      });

      this.setState({ filterVenues: this.venues });
    })
    .catch(error => {
      console.log(error);
      alert('Error loading page...');
    })
  }

  listItemClick = (venue) => {
    let marker = this.markers.filter(m => m.id === venue.id)[0];
    
    this.infowindow.setContent(marker.name);
    this.map.setZoom(13);
    this.map.setCenter(marker.position);
    this.infowindow.open(this.map, marker);
    this.map.panBy(0, -125);
    
    if (marker.getAnimation() !== null) { marker.setAnimation(null); }
    else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
    setTimeout(() => { marker.setAnimation(null) }, 2000);
  }

  filterVenues(query) {
    let f = this.venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    
    this.markers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
      marker.setVisible(true) :
      marker.setVisible(false);
    });

    this.setState({ filterVenues: f, query });
  }


  render() {
    return (
      <div>
        <div id="sidebar">
          <div id="errorMap" className="error-box">There is something wrong with Google Maps API</div>

          <h1 className="titulo"><span>Are you hungry?</span> Find yummy foods around Rio de Janeiro</h1>
          <input tabIndex="1" className="input-filter" placeholder="Type for filter on map..." value={this.state.query} onChange={(e) => { this.filterVenues(e.target.value) }} />

          {
            this.state.filterVenues && this.state.filterVenues.length > 0 && this.state.filterVenues.map((venue, index) => (
              <div className="venue-item" key={index} onClick={() => { this.listItemClick(venue) }}>
                { venue.name }
              </div>
            ))
          }

          <p className="copyright"><img src={logo} alt="Foursquare Logo" /> Powered by FourSquare</p>
        </div>
        
        <div id="map" tabIndex="0"></div>
      </div>
    );
  }
}

export default App;
