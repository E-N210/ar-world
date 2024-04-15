const distance = 0;
let pois = null;
var loaded = 1;
let addedEntities =[];
var additionalElements = 0
var info;

console.log(loaded)

function loading(){
if(loaded==0){
  console.log(loaded)
  document.getElementById("loading_screen").classList.remove("active")
  document.getElementById("loading_screen").classList.add("inactive")

  document.getElementById("infobutton").classList.add("active")
  document.getElementById("infobutton").classList.remove("inactive")}
}

async function getData(){
      const response =  await fetch('data.json');
//  console.log(response);


//-- NEXT LINE WAS pois = await response.json();
  pois =  await response.json();
  let minDistance = Number.MAX_VALUE;
}

window.addEventListener('gps-camera-update-position', async (e) => {

    console.log("gps-updated")

    //-- NEXT FUNCTION WAS await
     await getData();

    //  console.log(pois)
    if(pois){
      let noPOIfound = true;
      pois.features.forEach(feature => {
        const poiCoordinates = {
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        };


        const distance = calculateDistance(e.detail.position, poiCoordinates);
        const midpoint = calculateMidPoint(e.detail.position, poiCoordinates);

        //calculateMidPoint(e.detail.position, poiCoordinates);


      //  console.log(distance)

        if(distance<feature.properties.crop_dist){
            noPOIfound = false;
            createMyElement(feature)

            console.log(feature.properties.name,"Distance:", distance, "meters  was added");


            // HERE I SET UP ADDITIONAL ELEMENTS THAT RELY ON GPS positionX()

            if(additionalElements==0){
              additionalElements=1
               console.log("Label:", feature.properties.label);
            if(feature.properties.label && feature.properties.type=="gltf"){

              let textEntity = document.createElement("a-entity");
              textEntity.setAttribute('id', "TextEntity")
              textEntity.setAttribute('gps-new-entity-place', {
                            latitude: midpoint[0]-0.00004,
                            longitude:  midpoint[1]
                          });

              textEntity.setAttribute("position", {
                                x: 0,
                                y: feature.properties.position[1],
                                z: 0,
                          });

                          textEntity.setAttribute("scale", {
                                            x: feature.properties.scale_factor/4,
                                            y: feature.properties.scale_factor/4,
                                            z: feature.properties.scale_factor/4,
                                      });

              textEntity.setAttribute("rotation", {
                          x: 0,
                          y: 0,
                          z: 0,
                      });

              textEntity.setAttribute("look-at","#camera")
                console.log(feature.properties.text)
                  textEntity.setAttribute("text-geometry",{value: feature.properties.label, font: feature.properties.font_name})

                  document.querySelector("a-scene").appendChild(textEntity);

              console.log(feature.properties.name, "has text")

            }

            else {
              console.log(feature.properties.name, "doesn't have a label.");
            }

          }



          }

        else {

      removeExistingElement(feature)
      if(typeof textEntity !== 'undefined'){textEntitty.parentNode.removeChild(textEntity)}
    }
  // console.log(feature.properties.name,"dist",distance, "added" , feature.properties.added)

  })

  console.log(noPOIfound)

  if(noPOIfound==false){
      document.getElementById("noPOIscreen").style.display = "none"
      document.getElementById("POIscreen").style.display = "felx"}

  if(noPOIfound==true){

        document.getElementById("noPOIscreen").style.display = "flex"
        document.getElementById("POIscreen").style.display = "none"
        console.log("None of the features are below threshold.");}
    }


      loaded=0;
        loading()

});

function createMyElement (feature){


    if (addedEntities.includes(feature.properties.name))

    {
            console.log(`Entity with name "${feature.properties.name}" already exists. Skipping creation.`);
            return;
        }

    else  {

      addedEntities.push(feature.properties.name)

      let entity = document.createElement("a-entity");
      document.querySelector("a-scene").appendChild(entity);


          var assetItem = document.createElement('a-asset-item');
            assetItem.setAttribute('id', "asset"+feature.properties.name);
            assetItem.setAttribute('src', feature.properties.path);

          document.querySelector("a-scene").appendChild(assetItem);
          var assetItemId = '#' + assetItem.id;

                      //FROM HERE YOU SET STUFF ATTRIBUTE
          entity.setAttribute("id",feature.properties.name);


                      entity.setAttribute("scale", {
                                      x: feature.properties.scale_factor,
                                      y: feature.properties.scale_factor,
                                      z: feature.properties.scale_factor,
                                  });

                      entity.setAttribute("position", {
                                      x: feature.properties.position[0],
                                      y: feature.properties.position[1],
                                      z: feature.properties.position[2],
                                  });
                      console.log(feature.properties.rotation[0])
                      entity.setAttribute("rotation", {

                          x: feature.properties.rotation[0],
                          y: feature.properties.rotation[1],
                          z: feature.properties.rotation[2],
                      });


          if(feature.properties.type=="gltf") {
            entity.setAttribute("gltf-model", assetItemId);

            entity.setAttribute("animation-mixer", {clip: feature.properties.clip, timeScale:feature.properties.clip_speed} )
          }

          else if(feature.properties.type=="text"){
            entity.setAttribute("look-at","#camera")
                entity.setAttribute("text-geometry",{
                  value: feature.properties.label,
                  font: feature.properties.font_name})

              }

          entity.setAttribute('gps-new-entity-place', {
                        latitude: feature.geometry.coordinates[1]+feature.properties.position[0],
                        longitude: feature.geometry.coordinates[0]+feature.properties.position[2]
                      });


          if(feature.properties.behaviour){
                console.log(feature.properties.name, "has behaviour")
                entity.setAttribute(feature.properties.behaviour,true)
            }

            else{entity.removeAttribute(feature.properties.bheaviour)}
                  //    console.log(addedEntityNames)
                //    console.log(feature)
              //    }

            //  alert(feature.properties.name, "WAS ADDED")
            }


    }
function removeExistingElement(feature){
    if (addedEntities.includes(feature.properties.name))

                {

                const existingAssetItem = document.getElementById("asset"+feature.properties.name);
                if (existingAssetItem) {
                    existingAssetItem.parentNode.removeChild(existingAssetItem);
                }

                const existingLightBox = document.getElementById('light_box');
                if (existingLightBox) {
                    existingLightBox.parentNode.removeChild(existingLightBox);
                }

                       // Remove existing entity
                const existingEntity = document.getElementById(feature.properties.name);
                if (existingEntity) {
                    existingEntity.parentNode.removeChild(existingEntity);
                }

                       // Remove existing ground terrain
                const existingGroundTerrain = document.getElementById('ground_terrain');
                if (existingGroundTerrain) {
                    existingGroundTerrain.parentNode.removeChild(existingGroundTerrain);
                }
                  addedEntities = addedEntities.filter(item => item !== feature.properties.name)

                console.log("you Exited max distance", feature.properties.name , "deleted succesfully")
              }
}

function createContext(){

            let my_light = document.getElementById("my_light");
            let context_entity = document.getElementById("context_entity");
            let ground_terrain = document.getElementById("ground_terrain");

            my_light.setAttribute("position",{
              x: feature.properties.light_position[0],
              y: feature.properties.light_position[1],
              z: feature.properties.light_position[2],
            })

            context_entity.setAttribute('gps-new-entity-place', {
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0]
            });

            ground_terrain.setAttribute("geometry",{primitive: "plane"})
            ground_terrain.setAttribute("scale",{
              x:400/feature.properties.scale_factor,
              y:400/feature.properties.scale_factor,
              z:400/feature.properties.scale_factor,})


          ground_terrain.setAttribute('gps-new-entity-place', {
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0]
            });
            ground_terrain.setAttribute("width", 10);
            ground_terrain.setAttribute("height", 10);
            ground_terrain.setAttribute("material", { src: "transparent3.png", transparent:true, opacity:0.2});
            ground_terrain.setAttribute("position", {
                  x: feature.properties.position[0],
                  y: feature.properties.position[1],
                  z: feature.properties.position[2],
            })
            ground_terrain.setAttribute("rotation", {x:270,y:0,z:0})
            ground_terrain.setAttribute("emissiveIntensity",0)

            ground_terrain.setAttribute("shadow", "cast: true; receive: true; shadow-map-sharpness: 0,1");




          }

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

          const distance = R * c *1000; // Distance in meters

          return distance;
          }

function calculateMidPoint(coord1, coord2){
  const R = 6371; // Radius of the Earth in kilometers
  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);

  const midLat =  (coord1.latitude+coord2.latitude)/2
  const midLon =  (coord1.longitude+coord2.longitude)/2

  return [midLat, midLon]
}

function toRadians(degrees) {
          return degrees * (Math.PI / 180);
          }
function calculateBearing(lat1, lon1, lat2, lon2) {
            const lat1Rad = (lat1 * Math.PI) / 180;
            const lon1Rad = (lon1 * Math.PI) / 180;
            const lat2Rad = (lat2 * Math.PI) / 180;
            const lon2Rad = (lon2 * Math.PI) / 180;

            const dLon = lon2Rad - lon1Rad;
            const y = Math.sin(dLon) * Math.cos(lat2Rad);
            const x =
              Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
            let brng = Math.atan2(y, x);
            brng = (brng * 180) / Math.PI; // Convert radians to degrees
            brng = (brng + 360) % 360; // Normalize to 0-360 degrees
            return brng;
          }

function cursorBeaviour(){
  document.addEventListener("click", function(event) {
  // Get mouse position relative to the viewport
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Log or use the mouse position
  console.log("Mouse clicked at:", mouseX, mouseY);
})
}
cursorBeaviour()
// EVENT TEST
