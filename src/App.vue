<template>
  <div id="app">
    <div class="controlElements">
      <input placeholder="Новая точка маршрута" v-on:keyup.enter="createPoint()" v-on:blur="clearInput" v-model="addLabel" type="text">
      <p>Список маршрутов:</p>
      <draggable v-model="markers" @end="endDragList" @start="startDragList">
        <div class="list" style="display:flex" v-for="(point,key) in markers" :key="key">
          {{key+1}}:{{point.label}}
          <div class="deleteAddress" @click="deleteAddress(key)">&times;</div>
        </div>
      </draggable>
    </div>
    <GmapMap @center_changed="centerChange" ref="mapRef" :center="{lat:5, lng:108}" :zoom="1" map-type-id="terrain" style="width: 500px; height: 300px">
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
        centerMap: {
          lat: undefined,
          lng: undefined
        }
      }
    },
    methods: {
      /** Создаем новый введенный маршрут
       */
      createPoint() {
        /**  Проверяем не пустое ли поле ввода
         */
        if (this.addLabel === '') {
          return
        }
        let copy = _.cloneDeep(this.markerObj)
        copy.label = this.addLabel;
        copy.infoText = this.addLabel;
        copy.path.lat = this.centerMap.lat;
        copy.path.lng = this.centerMap.lng;
        copy.position.lat = this.centerMap.lat;
        copy.position.lng = this.centerMap.lng;
        this.markers.push(copy);
        this.addLabel = '';
        this.copyToPath();
      },
      /** Удаляем маршрут, как со списка, так и метку
       * @param {*} index- удаляемого маршрута
       */
      deleteAddress(index) {
        this.markers.splice(index, 1);
        this.infoWinOpen = false;
        this.path.splice(index, 1);
      },
      /** Измененные координаты центра карты присваиваем переменной, для дальнейшего исп-я
       */
      centerChange() {
        this.$refs.mapRef.$mapPromise.then((map) => {
          this.centerMap.lat = parseFloat(map.getCenter().lat());
          this.centerMap.lng = parseFloat(map.getCenter().lng());
        })

      },
      clearInput() {
        this.addLabel = '';
      },
      /** Конструктор информационного объекта, который открывается по клику на маркер
       * @param {*} marker- маркер
       * @param {*} idx- индекс маркер
       */
      toggleInfoWindow(marker, idx) {
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
      /** После перетаскивания маркера, присваеваем новые координаты маркеру
       * @param {*} marker- перетаскиваемый объект
       * @param {*} index- индекс объекта
       * @param {*} event- событие, по которому отлавливаем текущие координаты
       */
      markerDragEnd(marker, index, event) {
        marker.position.lat = event.latLng.lat();
        marker.position.lng = event.latLng.lng();
        this.markers[index].path.lat = marker.position.lat;
        this.markers[index].path.lng = marker.position.lng;
        this.copyToPath();
      },
      /**  Копируем координаты Линии из каждого маркера в массив, а далее строим на основе них Линии на карте.
       */
      copyToPath() {
        this.path.length = 0;
        for (let i = 0; i < this.markers.length; i++) {
          this.path.push(this.markers[i].path);
        }
      },
      endDragList() {
        this.copyToPath();
      },
      startDragList() {
        this.infoWinOpen = false;
      },
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
