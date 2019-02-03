<template>
  <div id="app">
    <div class="controlElements">
      <input placeholder="Новая точка маршрута" v-on:keyup.enter="savePoint()" v-on:blur="clearInput" v-model="addLabel" type="text">
      <p>Список маршрутов:</p>
      <draggable v-model="markers" @end="endDragList" @start="startDragList">
        <div class="list" style="display:flex" v-for="(point,key) in markers" :key="key">
          {{key+1}}:{{point.label}}
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
      <gmap-polyline v-if="path.length>0" :path="path">
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
          path: {
            lat: undefined,
            lng: undefined
          }
        },
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
      }
    },
    methods: {
      savePoint() {
        if (this.addLabel === '') {
          return
        }
        let copy = _.cloneDeep(this.markerObj)
        copy.label = this.addLabel;
        copy.infoText = this.addLabel;
        copy.path.lat = 5;
        copy.path.lng = 108;
        this.markers.push(copy);
        this.addLabel = '';
        this.copyToPath();
      },

      deleteAddress(index) {
        this.markers.splice(index, 1);
        this.infoWinOpen = false;
        this.path.splice(index, 1);
      },
      clearInput() {
        this.addLabel = '';
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
        marker.position.lat = event.latLng.lat();
        marker.position.lng = event.latLng.lng();
        this.markers[index].path.lat = marker.position.lat;
        this.markers[index].path.lng = marker.position.lng;
        this.copyToPath();
      },
      copyToPath() {
        this.path.length = 0;
        for (let i = 0; i < this.markers.length; i++) {
          this.path.push(this.markers[i].path);
        }
      },
      endDragList: function() {
        this.copyToPath();
      },
      startDragList: function() {
        this.infoWinOpen = false;
      },
    },
    mounted() {
      this.$refs.mapRef.$mapPromise.then((map) => {
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
