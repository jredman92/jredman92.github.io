let map;
let markers = [];

// load map
function init(){
	let myOptions = {
		zoom      : 14,
		center    : { lat:42.353350,lng:-71.091525},
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	let element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}

// Add bus markers to map
async function addMarkers(){
	// get bus data
	let locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(function(bus){
		let marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,15000);
}
        
        
        // Request bus data from MBTA
        async function getBusLocations(){
            let url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';	
            let response = await fetch(url);
            let json     = await response.json();
            return json.data;
        }
        
        // run();
        
        function addMarker(bus){
            let icon = getIcon(bus);
            let marker = new google.maps.Marker({
                position: {
                    lat: bus.attributes.latitude, 
                    lng: bus.attributes.longitude
                },
                map: map,
                icon: icon,
                id: bus.id
            });
            markers.push(marker);
        }
        
        function getIcon(bus){
            // select icon based on bus direction
            if (bus.attributes.direction_id === 0) {
                return 'otherimgs/blue.png';
            }
            return 'otherimgs/red.png';	
        }
        
        function moveMarker(marker,bus) {
            // change icon if bus has changed direction
            let icon = getIcon(bus);
            marker.setIcon(icon);
        
            // move icon to new lat/lon
            marker.setPosition( {
                lat: bus.attributes.latitude, 
                lng: bus.attributes.longitude
            });
        }
        
        function getMarker(id){
            let marker = markers.find(function(item){
                return item.id === id;
            });
            return marker;
        }

		async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	console.log(locations);

	// timer
	setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

run();
        
        window.onload = init;

// Background move with mouse 

const el = document.querySelector("#module");

el.addEventListener("mousemove", (e) => {
  el.style.backgroundPositionX = -e.offsetX + "px";
  el.style.backgroundPositionY = -e.offsetY + "px";
});