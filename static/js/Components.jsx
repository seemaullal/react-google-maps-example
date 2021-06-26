function Homepage(props) {
  return (
    <div id="home-banner" className="row">
      <div className="col">
        <h1>Ubermelon</h1>
        <p className="lead">Maps on demand.</p>
      </div>
    </div>
  );
}

function Navbar(props) {
  const { logo, brand } = props;

  return (
    <nav>
      <ReactRouterDOM.Link
        to="/"
        className="havbar-brand d-flex justify-content-center"
      >
        <img src={logo} height="30" />
        <span>{brand}</span>
      </ReactRouterDOM.Link>

      <section className="d-flex justify-content-end">
        <ReactRouterDOM.NavLink
          to="/map"
          activeClassName="navlink-active"
          className="nav-link nav-item"
        >
          Map
        </ReactRouterDOM.NavLink>
      </section>
    </nav>
  );
}

function Loading() {
  return (
    <div className="loading-box">
      <img src="static/img/watermelon-loading.png" alt="" />
      <div>Loading...</div>
    </div>
  );
}

function MapExample() {
  const [mapData, setMapData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const mapElementRef = React.useRef();
  const googleMapRef = React.useRef();

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/map_data")
      .then((response) => response.json())
      .then(data => {
        console.log('D', data);
        addMarkers(data);
        setMapData(data);
        setLoading(false);
      });
  }, []);

  function addMarkers(data) {
    const markers = [];
    console.log('mapData', data)
    for (const location of data) {
      console.log(location);
      markers.push(
        new google.maps.Marker({
          position: location.coords,
          title: location.name,
          map: googleMapRef.current,
        })
      );
    }

    for (const marker of markers) {
      const markerInfo = `
        <h1>${marker.title}</h1>
        <p>
          Located at: <code>${marker.position.lat()}</code>,
          <code>${marker.position.lng()}</code>
        </p>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: markerInfo,
        maxWidth: 200,
      });

      marker.addListener("click", () => {
        infoWindow.open(basicMap, marker);
      });
    }
  }

  React.useEffect(() => {
    if (loading) {
      return;
    }
    if (!window.google) {
      // Create an html element with a script tag in the DOM
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAjpErE26dDxvQMnZS8I-cUOGjz6WW3rik&libraries=places";
      document.head.append(script);
      script.addEventListener("load", () => {
        googleMapRef.current = new window.google.maps.Map(
          mapElementRef.current,
          {
            center: { lat: 37.601773, lng: -122.20287 },
            zoom: 11,
          }
        );
        return googleMapRef.current;
      });
      return () => script.removeEventListener("load");
    } else {
      // Initialize the map if a script element with google url is found
      googleMapRef.current = new window.google.maps.Map(mapElementRef.current, {
        center: { lat: 37.601773, lng: -122.20287 },
        zoom: 11,
      });
    }
  }, []); // add any dependencies (like things in props)

  // if custom styles needed, pass those as part of props also
  return (
    <div
      id="map-div"
      style={{
        height: 800,
        margin: `1em 0`,
        borderRadius: `0.5em`,
        width: 800,
      }}
      ref={mapElementRef}
    ></div>
  );

  if (loading) {
    return <Loading />;
  }
}
