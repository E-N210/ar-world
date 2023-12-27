let downloaded = false;
let closestPOI = null;
const entity = 0;
var animated = 0;
    let testEntityAdded = false;
    let my_light = null;



const el = document.getElementById('ar_camera');

window.addEventListener('gps-camera-update-position', async (e) => {


if(!testEntityAdded){
  console.log("gps-updated")
    const response = await fetch('data.json');
    console.log(response);
    const pois = await response.json();
    let minDistance = Number.MAX_VALUE;

            //  alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
              // Add a box to the north of the initial GPS position
    pois.features.forEach(feature => {
      const poiCoordinates = {
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0]
      };
      const distance = calculateDistance(e.detail.position, poiCoordinates);

      // Update closest POI if distance is smaller
           if (distance < minDistance) {
               minDistance = distance;
               closestPOI = feature;
           }
       });


    if (closestPOI) {


      var assetItem = document.createElement('a-asset-item');
      assetItem.setAttribute('id', 'current_asset');
      assetItem.setAttribute('src', closestPOI.properties.model);

      // Append the <a-asset-item> to <a-asset>
      document.querySelector("a-scene").appendChild(assetItem);


      const directionalLight = document.createElement("a-light");
      directionalLight.setAttribute('gps-new-entity-place', {
        latitude: closestPOI.geometry.coordinates[1],
        longitude: closestPOI.geometry.coordinates[0]
      });
        directionalLight.setAttribute("type", "point");
        directionalLight.setAttribute("intensity", "1");
        directionalLight.setAttribute("position", {
            x: closestPOI.properties.position_x,
            y: closestPOI.properties.position_y+200,
            z: closestPOI.properties.position_z,});
        directionalLight.setAttribute("target", el); // el is your camera element
        directionalLight.setAttribute("shadow", "cast: true; receive: true");
        directionalLight.setAttribute("castShadow", true)
  //    document.querySelector("a-scene").appendChild(directionalLight);

      let my_light = document.getElementById("my_light")
      my_light.setAttribute('gps-new-entity-place', {latitude: closestPOI.geometry.coordinates[1],
      longitude: closestPOI.geometry.coordinates[0]})
      const entity = document.createElement("a-entity");


        entity.setAttribute("scale", {
            x: closestPOI.properties.scale_factor,
            y: closestPOI.properties.scale_factor,
            z: closestPOI.properties.scale_factor,
        });

        entity.setAttribute("position", {
            x: closestPOI.properties.position_x,
            y: closestPOI.properties.position_y,
            z: closestPOI.properties.position_z,
        });

        entity.setAttribute("shadow", "cast: true; receive: true; shadow-map-sharpness: 0.1");

        //      entity.setAttribute('material', { color: 'red' } );
        entity.setAttribute('gps-new-entity-place', {
          latitude: closestPOI.geometry.coordinates[1],
          longitude: closestPOI.geometry.coordinates[0]
        });

            const modelPath = closestPOI.properties.model;
                entity.setAttribute("gltf-model", '#current_asset');

            if (animated==0)
            { animated = 1;
              entity.setAttribute("animation-mixer", 'clip:'+closestPOI.properties.clip , 'timeScale: 3');
              console.log("animation added - animated =" + animated);
            }
              document.querySelector("a-scene").appendChild(entity);




              const ground_terrain = document.createElement("a-entity");
              ground_terrain.setAttribute("geometry",{primitive: "plane"})
              ground_terrain.setAttribute("scale",{x:400,y:400,z:200})
              ground_terrain.setAttribute('gps-new-entity-place', {
                latitude: closestPOI.geometry.coordinates[1],
                longitude: closestPOI.geometry.coordinates[0]
              });
              ground_terrain.setAttribute("width", 10);
              ground_terrain.setAttribute("height", 10);
              ground_terrain.setAttribute("material", { src: "transparent3.png", transparent:true, opacity:0.2});
              ground_terrain.setAttribute("position", {
                    x: closestPOI.properties.position_x,
                    y: closestPOI.properties.position_y,
                    z: closestPOI.properties.position_z,
              })
              ground_terrain.setAttribute("rotation", {x:270,y:0,z:0})
              ground_terrain.setAttribute("emissiveIntensity",0)

              ground_terrain.setAttribute("shadow", "cast: true; receive: true; shadow-map-sharpness: 0,1");



              document.querySelector("a-scene").appendChild(ground_terrain);



            }


            console.log(closestPOI.geometry.coordinates[1])

          }

          testEntityAdded = true;
});


// Function to calculate the distance between two geographical coordinates
function calculateDistance(coord1, coord2) {
const R = 6371; // Radius of the Earth in kilometers
const lat1 = toRadians(coord1.latitude);
const lon1 = toRadians(coord1.longitude);
const lat2 = toRadians(coord2.latitude);
const lon2 = toRadians(coord2.longitude);

const dlat = lat2 - lat1;
const dlon = lon2 - lon1;

const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

const distance = R * c; // Distance in kilometers

return distance;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
return degrees * (Math.PI / 180);
}
