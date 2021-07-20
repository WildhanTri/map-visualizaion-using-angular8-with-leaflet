import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { fitBounds } from '../../util/GoogleMapsUtil'
import 'jquery'
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

  mkrss = []

  @ViewChild('googlemaps', { static: false }) mapRef: ElementRef;
  maps: google.maps.Map;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // var s = this.document.createElement("script");
    // s.type = "text/javascript";
    // s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAmVvlPEe7l5B6OXIMRTgVpMl_RdAqbqAI&libraries=geometry,visualization,drawing";
    // this.elementRef.nativeElement.appendChild(s);
    setTimeout(() => {
      // this.showMap();
      console.log("awokowakowakokaw")
      this.initMap();

    }, 1000);
  }

  initMap() {
    var indonesia = { lat: -2.6241998, lng: 123.7577348 };
    this.maps = new google.maps.Map(this.mapRef.nativeElement, {
      center: indonesia,
      zoom: 5,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      gestureHandling: 'greedy',
      mapTypeControl: false
    });
  }

  importProgress = 0
  importLocation() {
    let count = 0

    this.rawData = this.importingRawData

    this.markers = []
    console.log(this.rawData)
    for (let rd of this.rawData) {
      try {
        var marker = L.marker(new L.LatLng(rd[this.inputLatitude], rd[this.inputLongitude]))
        marker.bindPopup("<b>" + rd.name + "</b>")

        this.drawJobMarker(rd.name, rd[this.inputLatitude], rd[this.inputLongitude])
      } catch (e) {
        console.error(e)
      }
      count++;
      this.importProgress = count / this.rawData.length
    }

    this.importProgress = 0;
    $('#exampleModal').modal('toggle');

    this.boundLatlngs()
  }

  boundLatlngs(){
    fitBounds(this.maps, this.mkrss)
  }

  file
  arrayBuffer
  onFileSelect(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      for (var i = 0; i < arraylist.length; i++) {
        if (i == 0) {
          for (var key of Object.keys(arraylist[i])) {
            this.latlongHeader.push(key)
          }
        }

        this.importingRawData.push(arraylist[i])
      }
    }
  }

  drawJobMarker(title, latitude, longitude) {
    var marker: google.maps.Marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: this.maps
    });

    marker.set("title", title)

    var infowindow: google.maps.InfoWindow = new google.maps.InfoWindow();

    marker.addListener('mouseover', (e) => {
      // var contentString = '<div class="col-9" style="display: flex;align-items: center;margin-bottom:15px">' +
      //   '<div>' +
      //   '<p style="margin:0px"><b>' + title + '</b></p>' +
      //   '</div>' +
      //   '</div>'
      // infowindow.setContent(contentString)
      // infowindow.open(this.maps, marker);
    });

    marker.addListener('mouseout', (e) => {

    });
    marker.addListener('click', (e) => {

    });

    this.mkrss.push(marker);
  }
}
