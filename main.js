import { detecIcon, detecType, setStorage } from "./helpers.js";

//! HTML den gelenler
const form=document.querySelector("form")
const list=document.querySelector("ul")

//! OLay İzleyicileri
form.addEventListener("submit",handleSubmit)
list.addEventListener("click",handleClick)
//! Ortak Kullanım alanı
let map;
let coords=[];
let notes=JSON.parse(localStorage.getItem("notes")) || [];
let layerGroup=[];
console.log(JSON.parse(localStorage.getItem("notes")))
//Kullanıcının konumunu ogrenme
navigator.geolocation.getCurrentPosition(loadMap,console.log("kullanıcı kabul etmedi"))

//Haritaya tıklanınca calısır
function onMapClick(e){
    form.style.display="flex"
    coords=[e.latlng.lat,e.latlng.lng]
    console.log(coords)
}
//Kullanıcının konumuna göre ekranda haritayı gosterme
function loadMap(e){
    console.log(e)
    //haritanın kurulumu
    map=new L.map("map").setView([e.coords.latitude,e.coords.longitude],10)
    L.control;
    //Haritanın nasıl gozukecegini belirler
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//haritada imlecleri tutacagımız katman
layerGroup=L.layerGroup().addTo(map)

//localden gelen notesları listeleme
renderNoteList(notes)

//Haritada bir tıklanma oldugunda calısacak fonksiyon
map.on('click',onMapClick);

}
//* ekrana marker basma
function renderMarker(item){
    console.log(item)
    //markerı olusturur
    L.marker(item.coords,{icon:detecIcon(item.status)})
    //imleclerin oldugu katmana ekler
    .addTo(layerGroup)
    //uzerine tıklanınca acılacak popup ekleme
    .bindPopup(`${item.desc}`)
    
}


//*Form gönderildiginde calısır
function handleSubmit(e){
    e.preventDefault();
    console.log(e)
    const desc=e.target[0].value
    const date=e.target[1].value
    const status=e.target[2].value
    //Notes dizisine eleman ekleme
    notes.push({id:new Date().getTime(),desc,date,status,coords})
    console.log(notes)
    //Local storage guncelleme
    setStorage(notes)
    //notları ekrana aktarabilmek için fonksiyon note dizisini parametre olarak gönderdik
    renderNoteList(notes)

    //Form gönderildiginde kapanır
    form.style.display="none"

}
function renderNoteList(item){
    list.innerHTML=""
    layerGroup.clearLayers();
    item.forEach((item)=>{
        const listElement=document.createElement("li")
        //datasına sahip olduğu id yi ekleme
        listElement.dataset.id=item.id
        listElement.innerHTML=`
        <div>
            <p>${item.desc}</p>
            <p><span>Tarih:</span> ${item.date}</p>
            <p><span>Durum:</span> ${detecType(item.status)}</p>
        </div>
        <i class="bi bi-x-lg" id="delete"></i>
        <i class="bi bi-airplane-fill" id="fly"></i>
        `
        list.insertAdjacentElement("afterbegin",listElement)
        //Ekrana marker basma
        renderMarker(item)
    })

}

function handleClick(e){
    console.log(e.target.id)
    //güncellenecek elemanın id'sini öğrenme
    const id=e.target.parentElement.dataset.id
    console.log(notes)
    if(e.target.id=="delete"){
        console.log("tıklanıldı")
        //id sini bildigimiz elemanı diziden kaldırma
        notes=notes.filter((note)=>note.id != id)
        console.log(notes)
        //localstorage i guncelleme
        setStorage(notes)
        //ekranı güncelle
        renderNoteList(notes)
        
    }
    if(e.target.id=="fly"){
        const note=notes.find((note)=>note.id==id)
        map.flyTo(note.coords)
    }
}