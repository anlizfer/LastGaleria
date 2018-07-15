/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        
        app.receivedEvent('deviceready');

        var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
         get_noticias();
  };

  window.plugins.OneSignal
    .startInit("37283672-1ff2-435c-b3ad-01ce1c43db6e")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  
}, false);

var puerto_servidor="";
var servidor_ws="http://galeria.aedigital.co"+puerto_servidor;
var zoom_mapa=13;
var transicion="slide";

function get_noticias(){
   var request = $.ajax({
    url: servidor_ws+"/get_notificaciones.php",
    type: "POST",
    data: {            
            idusuario:"1"
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){
          
          var objdata=msg.datos;

          var cadena_noticias="";


          for(var i=0; i<objdata.length; i++){

              cadena_noticias+='<div class="row" style="border-bottom: 1px solid #ccc; padding-bottom: 5px;" onclick="get_noticias_detalle('+objdata[i].idnoticias+')">';
              cadena_noticias+='  <div class="col-xs-3" style="text-align: center;" >';
              cadena_noticias+='    <div style="    margin-top: 29px; margin-left: 11px; margin-top:10px; border-radius: 60px; background-color: #f8ea26;  width: 60px; height: 60px; background-position: center; background-size: 45px 45px; background-image: url(assets/img/boton_campana.png);">';
              cadena_noticias+='    </div>';
              cadena_noticias+='  </div>';
              cadena_noticias+='  <div class="col-xs-9" >';
              cadena_noticias+='    <h4>'+objdata[i].tituloNoticia+'</h4>';
              cadena_noticias+='    <p style="font-size: 12px;">'+objdata[i].descripcionNoticia+'</p>';
              cadena_noticias+='    <i>Fecha: '+objdata[i].fechaNoticia+'</i>';
              cadena_noticias+='  </div>';
              cadena_noticias+='</div>';
              cadena_noticias+='';

           
          } 

          //$("#listado-noticias").html(cadena_noticias);
          $("body").html(cadena_noticias);

          window.plugins.OneSignal
    .startInit("37283672-1ff2-435c-b3ad-01ce1c43db6e")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit().sendTag({"tipousuario", "1"});

    alert("Envio el tag");

      }else{
          abrir_mensajes(msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       alert("No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente. "+textStatus+"  "+jqXHR);
    });
}