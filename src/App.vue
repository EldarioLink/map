<template>
  <div id="app">
    <div class="controlElements">
      <input placeholder="Новая точка маршрута" v-on:keyup.enter="saveAddress()"
      v-on:blur="clearInp" v-model="addLabel" type="text">
      <p>Список маршрутов:</p>
      <draggable v-model="markers" @end="endDrag"  @start="startDrag">
        <div class="list" style="display:flex" v-for="(markerAddress,key) in markers" :key="key">
          {{key+1}}:{{markerAddress.label}}
          <div class="deleteAddress" @click="deleteAddress(key)">&times;</div>
        </div>
      </draggable>
    </div>
    <GmapMap ref="mapRef" :center="{lat:5, lng:108}" :zoom="1" map-type-id="terrain" style="width: 500px; height: 300px">
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
        {{infoContent}}
      </gmap-info-window>
      <GmapMarker @dragstart="markerDragStart(marker,index,$event)" @dragend="markerDragEnd(marker,index,$event)" ref="marker" :key="index" v-for="(marker, index) in markers" @click="toggleInfoWindow(marker,index)" :position="marker.position" :clickable="true"
        :draggable="true" />
      <gmap-polyline v-if="path.length > 0" :path="path">
      </gmap-polyline>
    </GmapMap>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        addLabel: '',
        markers: [],
        markerObj: {
          label: '',
          position: {
            lat: 5,
            lng: 108,
          },
          infoText: '1',
        },
        idCounter: 0,
        path: [],
        infoContent: '',
        infoWindowPos: null,
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        infoWindowCounter: 1,
        coordsPol: {
          lat: '',
          lng: ''
        },
      }
    },
    methods: {
      saveAddress() {
        if (this.addLabel === '') {
          return
        }
        let copy = _.cloneDeep(this.markerObj)
        copy.label = this.addLabel;
        copy.infoText = this.addLabel
        copy.id = this.idCounter
        this.idCounter++;
        this.infoWindowCounter++;
        this.markers.push(copy)
        this.addLabel = '';
        let cordsPol = _.clone(this.coordsPol);
        cordsPol.lat = 5;
        cordsPol.lng = 108;
        this.path.push(cordsPol);
      },

      deleteAddress(index) {
        console.log(index)
        this.markers.splice(index, 1);
        this.infoWinOpen = false
        this.path.splice(index, 1)
        // function isPrime(firstEl, index) {
        //   return firstEl.id === index;
        // }
        // console.log(this.markers.findIndex(isPrime));
      },
      clearInp() {
        this.addLabel = ''
      },
      toggleInfoWindow: function(marker, idx) {
        this.infoWindowPos = marker.position;
        this.infoContent = marker.infoText;
        if (this.currentMidx == idx) {
          this.infoWinOpen = !this.infoWinOpen;
        } else {
          this.infoWinOpen = true;
          this.currentMidx = idx;
        }
      },
      markerDragStart() {
        this.infoWinOpen = false;


      },
      markerDragEnd(marker, index, event) {
        marker.position.lat = event.latLng.lat()
        marker.position.lng = event.latLng.lng()
        let cordsPol = _.clone(this.coordsPol);
        cordsPol.lat = marker.position.lat;
        cordsPol.lng = marker.position.lng;
        this.path.splice(index, 1, cordsPol)
      },
      endDrag: function() {
        // let length = this.markers.length;
        // for (let i = 0; i < length; i++) {
        //   this.markers[i].id = i;
        //   console.log(this.markers[i].id)
        // }


      },
      startDrag: function() {
        console.log(this.markers)
      },
    },
    mounted() {
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo({
          lat: 5,
          lng: 108
        })
        map.setOptions({
          gestureHandling: 'none'
        });

      })
    },
  }
</script>

<style>
  #app {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    font-size: 15pt;
    color: #330000;
  }

  .deleteAddress {
    margin-left: 10px;
    font-size: 15pt;
    cursor: pointer;
  }

  .list {
    cursor: pointer;
  }
</style>
