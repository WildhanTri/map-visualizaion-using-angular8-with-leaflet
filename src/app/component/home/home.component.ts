import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import readXlsxFile from 'read-excel-file'
import 'jquery'
import "leaflet";
import "leaflet-canvas-marker"
declare let L
declare let $

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  fileName;
  csvContent: string;

  latlongHeader = []

  inputLatitude;
  inputLongitude;

  rawData = [];
  importingRawData = [];

  map
  ciLayer
  markers = []

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.map = L.map('map', {
      center: [-4.059637, 117.486081],
      zoom: 5,
      preferCanvas: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoid2lsZGhhbnRyaSIsImEiOiJjazYzbW16YXkwOGNkM2twYTRxbzQxN2xwIn0.rshyTLtbA39-KGTzC1bV5A'
    }).addTo(this.map);

    this.ciLayer = L.canvasIconLayer({});
    this.ciLayer.addTo(this.map)
  }

  onFileSelected(event) {
    this.fileName = event.target.files[0].name
    readXlsxFile(event.target.files[0]).then((rows) => {
      console.log(rows)
    })
  }

  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;

    var csvJsonString = []
    csvJsonString = this.csvContent.split("\n");
    var csvJsonObject = []
    for (let i = 0; i < csvJsonString.length; i++) {
      if (i == 0) {
        this.latlongHeader = csvJsonString[i].split(new RegExp(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
      }
      csvJsonObject.push(csvJsonString[i].split(new RegExp(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)")))
    }

    let index = 0;
    let header = []
    let results = []
    for (let r1 of csvJsonObject) {
      if (index > 0) {
        let map = {}
        let index2 = 0
        for (let h of header) {
          map[h] = r1[index2]

          if (h == "latitude") {
            this.inputLatitude = h
          }
          if (h == "longitude") {
            this.inputLongitude = h
          }

          index2++;
        }
        results.push(map)
      } else {
        for (let r2 of r1) {
          header.push(r2)
        }
      }
      index++;
    }
    this.importingRawData = results
  }

  onFileSelect(input) {
    const files = input.target.files;
    this.fileName = files[0].name
    var content = this.csvContent;

    if (files && files.length) {
      const fileToRead = files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.onFileLoad(e)
      }
      fileReader.readAsText(fileToRead, "UTF-8");
    }
  }

  importProgress = 0
  importLocation() {
    let count = 0

    // Adds a layer
    // this.map.removeLayer(this.layerGroup)
    // this.layerGroup = L.layerGroup().addTo(this.map);
    // Marker definition
    // Adding marker to layer
    // this.ciLayer.removeMarker()
    // this.map.removeLayer(this.ciLayer)

    for(let m of this.markers){
      this.ciLayer.removeLayer(m)
    }

    this.rawData = this.importingRawData
    
    this.markers = []
    console.log(this.rawData)
    for (let rd of this.rawData) {
      try {
        var marker = L.marker(new L.LatLng(rd[this.inputLatitude], rd[this.inputLongitude]))
        marker.bindPopup("<b>"+rd.name+"</b>")
        this.markers.push(marker)
      } catch (e) {
        console.error(e)    
      }
      count++;
      this.importProgress = count / this.rawData.length
    }

    this.ciLayer.addMarkers(this.markers)
    this.importProgress = 0;
    $('#exampleModal').modal('toggle');
  }
}
