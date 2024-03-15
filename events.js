AFRAME.registerComponent('upscale',{

            schema: { color:{default: "red"}},

          init: function(){
            getData()
            pois.features.forEach(feature => {
              const element=document.getElementById(feature.properties.name)

              if (element) {if (feature.properties.behaviour == "upscale"){

                  // Set the scale attribute
            element.addEventListener('mouseenter', function () {
                element.setAttribute('scale', { x: 0.25, y: 0.25, z: 0.25 });
                console.log("upscale_bis was triggered")
            })
                element.addEventListener('mouseleave', function () {
                  element.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
                })
              }
            }
    })
}

})

AFRAME.registerComponent('upscale_bis',{

            schema: { color:{default: "red"}},

          init: function(){
            getData()
            pois.features.forEach(feature => {
              const element=document.getElementById(feature.properties.name)

              if (element) {if (feature.properties.behaviour == "upscale_bis"){
                element.addEventListener("mouseenter", function () {
                  // Set the scale attribute
                element.setAttribute('scale', { x: 0.005, y: 0.005, z: 0.005 });
                console.log("upscale was triggered")
            })
                element.addEventListener('mouseleave', function () {
                  element.setAttribute('scale', { x: 0.01, y: 0.01, z: 0.01 });
                })
              }
            }
    })
}

})


AFRAME.registerComponent('look-at', {
  schema: { type: 'selector' },

  tick: function () {
    this.el.object3D.lookAt(this.data.object3D.position)
  }

})

AFRAME.registerComponent('look-at1',{

            schema: { color:{default: "red"}},

          init: function(){
            getData()
            pois.features.forEach(feature => {
              const element=document.getElementById(feature.properties.name)

              if (element) {if (feature.properties.behaviour == "look-at1"){
                  // Set the scale attribute
                element.setAttribute("look-at","#camera")
              }
            }
    })
}

})
