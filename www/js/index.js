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
/*var app = {
    
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {

        inicial();
        app.receivedEvent('deviceready');

        var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    get_noticias();
    abrir_form_notificaciones();
         
  };

  window.plugins.OneSignal
    .startInit("37283672-1ff2-435c-b3ad-01ce1c43db6e")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

        
    },
    
    receivedEvent: function(id) {
       
    }
};*/


$( document ).ready(function() {
   inicial();
});

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  
}, false);


var puerto_servidor="";
var servidor_ws="https://galeria.aedigital.co"+puerto_servidor;

var zoom_mapa=13;

var transicion="slide";

var whatsapp_asesor="";


$("#btn_chat").click(function(){
   window.open("https://tawk.to/chat/5a68b47dd7591465c7070e7f/default","_blank");
});

$("#btnwhatsapp").click(function(){
  window.open("https://api.whatsapp.com/send?phone=57"+getWhatsapp()+"&text=Hola%20me%20podrías%20dar%20más%20información%20acerca%20de",'_system');
})





function getWhatsapp()
{
    var max=obj_asesores.length;
    max=max-1;
    var min=0;
    var ind=Math.floor(Math.random()*(max-min+1)+min);



    $(".numero_whatsapp").html(""+obj_asesores[ind].whatsappAsesor);

    $(".btn_numero_whatsapp").click(function(){
      window.open("https://api.whatsapp.com/send?phone=57"+obj_asesores[ind].whatsappAsesor+"&text=Hola%20me%20podrías%20dar%20más%20información%20acerca%20de",'_system');
    })

    return obj_asesores[ind].whatsappAsesor;
}


//BOTON ATRÁS
$( ".btnatras" ).click(function() {
    $.mobile.back();    
});

function abrir_mensajes(titulo,mensaje){
    $("#titulo-mensaje").html(""+titulo);
    $("#cuerpo-mensaje").html(""+mensaje);
    $("#mensajes-galeria").modal("show");

}




function inicial(){
    get_noticias();
    console.log(localStorage.emailusuario);

    if(""+localStorage.emailrecuperacion!="undefined"){
      $("#txtemail_lostpassword").val(""+localStorage.emailrecuperacion);
    }


    if(localStorage.emailusuario!="" && localStorage.passwordusuario!=""){

      if(""+localStorage.emailusuario!="undefined" && ""+localStorage.passwordusuario!="undefined"){
          email_login=""+localStorage.emailusuario;
          password_login=""+localStorage.passwordusuario;
          ajax_login(email_login,password_login,"0");
      }else{
         //$("#mensajes-registro").modal("show");
      }

    }else{
         //$("#mensajes-registro").modal("show");
    }

    cargar_tipo_aptos();

}



/*
LOGIN INICIO
Autor: ANGEL LIZCANO
Descripcion:  Formulario de Ingreso al sistema

####################################################
*/
$( "#form-login" ).submit(function( event ) {
  event.preventDefault();
  enviar_login();
});

var email_login="";
var password_login="";
function enviar_login(){
    email_login=""+$("#txtemail_login").val();
    password_login=""+$("#txtpassword_login").val();

    ajax_login(email_login,password_login,"1");
    
}


$("#btncontinuar").click(function(){
  $(".info-login").show();

    ir_menu_principal();
});



var datos_usuario=new Object();
var datos_tipousuario=new Object();

function ajax_login(email_log,password_log,tip){
  var request = $.ajax({
    url: servidor_ws+"/login_app.php",
    type: "POST",
    data: {

            email_login:""+email_log,
            password_login:""+password_log
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);  
     datos_usuario=msg.datos;

     datos_tipousuario=msg.tipousuario;



      if(msg.status=="ok"){

          //abrir_mensajes("Bienvenido",datos_usuario[0].nombreusuario+" Bienvenido a Galería Inmobiliaria");

          $(".info-login").show();
          $(".nombre-usuario-registrado").html(""+datos_usuario[0].nombreusuario);

          localStorage.setItem("idusuario", ""+datos_usuario[0].idusuario);
          localStorage.setItem("passwordusuario", ""+password_log);
          localStorage.setItem("emailusuario", ""+datos_usuario[0].emailusuario);

          $("#codigo_usuario").html(""+datos_usuario[0].idusuario);


          $("#txtemail_registro_update").val(""+datos_usuario[0].emailusuario);
          $("#txtnombre_registro_update").val(""+datos_usuario[0].nombreusuario);
          $("#txtapellido_registro_update").val(""+datos_usuario[0].apellidousuario);
          $("#txttelefono_registro_update").val(""+datos_usuario[0].telefonousuario);

          $("#txtidentificacion_registro_update").val(""+datos_usuario[0].identificadorusuario);


          var roles_sel=datos_usuario[0].roles;

          var arra_roles=Array();

          arra_roles=roles_sel.split(",");

          for(var j=0;j<arra_roles.length;j++){
              $("#chk"+arra_roles[j]+"_update").prop("checked",true);
          }

         

          $("#cv_propietarios").hide();
          $("#cv_arrendatarios").hide();
          $("#cv_pagosonline").hide();

          idusuario=""+datos_usuario[0].idusuario;


          console.log(datos_tipousuario);

          for(var j=0;j<datos_tipousuario.length;j++){
            tipousuario+=""+datos_tipousuario[j].idcategoria+",";

            if(""+datos_tipousuario[j].idcategoria=="3"){
              $("#cv_propietarios").show();
               $("#cv_pagosonline").show();
            }

            if(""+datos_tipousuario[j].idcategoria=="1"){
              $("#cv_arrendatarios").show();
              $("#cv_pagosonline").show();
            }


          }

          tipousuario=tipousuario.slice(0,-1);

                 

          


          $("#contain-log").show();

          $("#nombre-login").html(""+datos_usuario[0].nombreusuario+" "+datos_usuario[0].apellidousuario);

          //enviar_tag(tipousuario);//ASIGNA EL TAG tipousuario=1 al usuario en onesignal //android

                    

          if(tip=="1"){
              ir_menu_principal();
          }
          

      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });
}




function ir_lost_pass(){  
    $.mobile.changePage("#pagina-lost-password",{transition:transicion,changeHash: true});
}


//BOTON OMITIR
$( "#btnomitir" ).click(function() {

    

    $(".info-login").hide();
    $(".nombre-usuario-registrado").html("");

    ir_menu_principal();
});

function ir_menu_principal(){

 

    $("#btnmenu_inmueble").show();
    $("#btnmenu_convenios").show();
    $("#btnmenu_acercagaleria").show();
    $("#btnmenu_usuario").show();

  


  $.mobile.changePage("#menu-principal",{transition:transicion,changeHash: true});
}




/*
####################################################
*/





/*
FORMULARIO LOST PASSWORD
Autor: ANGEL LIZCANO
Descripcion:  Formulario recuperación de contraseña

####################################################
*/
$( "#form-lostpassword" ).submit(function( event ) {
  event.preventDefault();
  enviar_lostpassword();
});

var email_lostpassword="";
function enviar_lostpassword(){
    email_lostpassword=""+$("#txtemail_lostpassword").val();
    solicitar_email();
}

function ir_verificar(){
    $.mobile.changePage("#pagina-verificar-code",{transition:transicion,changeHash: true});
}


function solicitar_email(){
 
  
  var request = $.ajax({
    url: "https://www.wikomm.com/enviar_mensaje_app.php",
    type: "POST",
    data: {
            email:""+email_lostpassword
          }
    });

    request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg!="error"){

          localStorage.emailrecuperacion=""+email_lostpassword;

          ir_verificar();     
          abrir_mensajes("Ingresa el Código de Verificación","Se ha enviado un correo con el código de verificación de 4 cifras, Ingresa el código para solicitar el cambio de contraseña.");
      }else{
          abrir_mensajes("Error","El correo no existe.");
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });

}





$("#form-nuevopassword").submit(function( event ) {
    event.preventDefault();
    enviar_cambios_password();
});

function enviar_cambios_password(){
  var new_passw=$("#txt_newpassword").val();
    var new_pass_re=$("#txt_re_newpassword").val();

    if(new_passw==""){
      abrir_mensajes("Error","Debes insertar un nuevo password");
      return;
    }

    if(new_pass_re==""){
      abrir_mensajes("Error","Debes insertar un nuevo password para verificar");
      return;
    }

    if(""+new_passw!=""+new_pass_re){
      abrir_mensajes("Error","Los password no coinciden");
      return;
    }


    var request = $.ajax({
    url: servidor_ws+"/cambiar_password.php",
    type: "POST",
    data: {
            email:""+localStorage.emailrecuperacion,
            new_passw:""+new_passw
          }
    });

    request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg=="ok"){
            abrir_mensajes("Cambio Generado","El password ha sido modificado correctamente.");
            $.mobile.changePage("#pagina-login",{transition:transicion,changeHash: true});
      }else{
          abrir_mensajes("Error","Error al generar el nuevo password");
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
      console.log("Entro esta vaina");
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });
}



/*
####################################################
*/



/*
FORMULARIO VERIFICAR CODIGO
Autor: ANGEL LIZCANO
Descripcion:  Formulario recuperación de contraseña - verificacion de contraseña

####################################################
*/


$( "#form-verificar" ).submit(function( event ) {
  event.preventDefault();
  enviar_verificacion();
});

var codigo_verificacion="";
function enviar_verificacion(){
    var codigo1=""+$("#txtcode1").val();
   

    codigo_verificacion=codigo1;
    verificar_codigo();

}

function verificacion_numero(){

}

function ir_registro(){    
    $.mobile.changePage("#pagina-registro",{transition:transicion,changeHash: true});
}


$("#btnreenviar").click(function() {
    //REENVIAR CODIGO.
    enviar_lostpassword();
});



$("#btn_ir_a_verificar").click(function(){
    $("#txtemail_lostpassword").val(""+localStorage.emailrecuperacion);
    ir_verificar();
});





function verificar_codigo(){
 
  
  var request = $.ajax({
    url: servidor_ws+"/verificar_codigo.php",
    type: "POST",
    data: {
            email:""+localStorage.emailrecuperacion,
            code:""+codigo_verificacion
            
          }
    });

    request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg=="ok"){
            $.mobile.changePage("#pagina-lost-password-recuperar",{transition:transicion,changeHash: true});
      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });

}







/*
####################################################
*/



/*
FORMULARIO VERIFICAR CODIGO
Autor: ANGEL LIZCANO
Descripcion:  Formulario registro de usuario

####################################################
*/



$( "#form-registro" ).submit(function( event ) {
  event.preventDefault();
  enviar_formulario_registro();  
});


$("#form-registro-update").submit(function( event ) {
  event.preventDefault();
  enviar_formulario_modificar();
});



var txtemail_registro_update="";
var txtnombre_registro_update="";
var txtapellido_registro_update="";
var txtpassword_registro_update="";
var txttelefono_registro_update="";
var txtidentificacion_registro_update="";


function enviar_formulario_modificar(){
  txtemail_registro_update=""+$("#txtemail_registro_update").val();
  txtnombre_registro_update=""+$("#txtnombre_registro_update").val();
  txtapellido_registro_update=""+$("#txtapellido_registro_update").val();
  txtpassword_registro_update=""+$("#txtpassword_registro_update").val();
  txttelefono_registro_update=""+$("#txttelefono_registro_update").val();
  txtidentificacion_registro_update=""+$("#txtidentificacion_registro_update").val();

  var request = $.ajax({
    url: servidor_ws+"/guardar_usuario_app.php",
    type: "POST",
    data: {
            idusuario:""+idusuario,
            nombreusuario:""+txtnombre_registro_update,
            apellidousuario:""+txtapellido_registro_update,
            emailusuario:""+txtemail_registro_update,
            telefonousuario:""+txttelefono_registro_update,
            passwordusuario:""+txtpassword_registro_update,
            identificadorusuario:""+txtidentificacion_registro_update
          }
    });

    request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){

          localStorage.setItem("idusuario", ""+idusuario);
          if(txtpassword_registro_update!=""){
              localStorage.setItem("passwordusuario", ""+txtpassword_registro_update);
          }
          
          localStorage.setItem("emailusuario", ""+txtemail_registro_update);
          

          abrir_mensajes(" Modificación Éxitosa","Datos modificados correctamente");

          $(".info-login").show();
          $(".nombre-usuario-registrado").html(""+txtnombre_registro_update);

          
          ir_menu_principal();

      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });

}



var txtemail_registro="";
var txtnombre_registro="";
var txtapellido_registro="";
var txtpassword_registro="";
var txttelefono_registro="";
var txtidentificacion_registro="";
var idusuario="";
var tipousuario="0";

var roles="";



function enviar_formulario_registro(){


  $("#btnregistrar").prop("disabled",true);

  txtemail_registro=""+$("#txtemail_registro").val();
  txtnombre_registro=""+$("#txtnombre_registro").val();
  txtapellido_registro=""+$("#txtapellido_registro").val();
  txtpassword_registro=""+$("#txtpassword_registro").val();
  txttelefono_registro=""+$("#txttelefono_registro").val();
  txtidentificacion_registro=""+$("#txtidentificacion_registro").val();

  var roles="";

  if($("#chk1").is(":checked")){
      roles+="1,";
  }

  if($("#chk2").is(":checked")){
      roles+="2,";
  }

  if($("#chk3").is(":checked")){
      roles+="3,";
  }

  if($("#chk4").is(":checked")){
      roles+="4,";
  }


  roles = roles.slice(0, -1); 



  var request = $.ajax({
    url: servidor_ws+"/guardar_usuario_app.php",
    type: "POST",
    data: {
            idusuario:"",
            nombreusuario:""+txtnombre_registro,
            apellidousuario:""+txtapellido_registro,
            emailusuario:""+txtemail_registro,            
            telefonousuario:""+txttelefono_registro,
            passwordusuario:""+txtpassword_registro,
            identificadorusuario:""+txtidentificacion_registro,
            roles:""+roles
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){

          idusuario=""+msg.idusuario;

          localStorage.setItem("idusuario", ""+idusuario);
          localStorage.setItem("passwordusuario", ""+txtpassword_registro);
          localStorage.setItem("emailusuario", ""+txtemail_registro);
          
          var email_login=""+localStorage.emailusuario;
          var password_login=""+localStorage.passwordusuario;
          ajax_login(email_login,password_login,"0");

          //abrir_mensajes("Registro con Éxito",txtnombre_registro+" Bienvenido a Galería Inmobiliaria");

          $(".info-login").show();
          $(".nombre-usuario-registrado").html(""+txtnombre_registro);

          $("#btnregistrar").prop("disabled",false);

          
          ir_menu_principal();

      }else{
          abrir_mensajes("Error",msg.mensaje);
          $("#btnregistrar").prop("disabled",false);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
       $("#btnregistrar").prop("disabled",false);
    });
  
}


/*
####################################################
*/



/*
FORMULARIO MENU PRINCIPAL
Autor: ANGEL LIZCANO
Descripcion:  Formulario Menu Principal

####################################################

<button type="button" class="btn btn-default btn-menu-vertical btn-lg btninmuebles_vert">INMUEBLES</button>
<button type="button" class="btn btn-default btn-menu-vertical btn-lg btnconvenios_vert">CONVENIOS</button>
<button type="button" class="btn btn-default  btn-menu-vertical btn-lg btnacerca_vert">ACERCA DE GALERÍA INMOBILIARIA</button>
<button type="button" class="btn btn-default  btn-menu-vertical btn-lg btnusuario_vert">USUARIO</button>
<button type="button" class="btn btn-default  btn-menu-vertical btn-lg btncerrar_vert">CERRAR SESIÓN</button>
*/

//BOTON INMUEBLE




$( ".btnpagosenlinea_vert,#btnmenu_pagosenlinea" ).click(function() {
     window.open("https://www.e-collect.com/customers/GaleriaInmobiliaria.htm","_blank");
});


$( "#btnmenu_inmueble,.btninmuebles_vert" ).click(function() {
    abrir_form_inmuebles();
});
//BOTON INMUEBLE
$( "#btnmenu_acercagaleria,.btnacerca_vert" ).click(function() {
  abrir_form_info_galeria();
});
//BOTON INMUEBLE
$( "#btnmenu_usuario,#btnmenu_usuario2,.btnusuario_vert" ).click(function() {
    abrir_form_update_usuario();
});
//BOTON INMUEBLE
$( "#btnmenu_convenios,.btnconvenios_vert" ).click(function() {
  abrir_form_convenios();
});

$( "#btnmenu_ayuda" ).click(function() {
  abrir_form_ayudas();
});

$("#btnnotificaciones_main,.btnoticias_vert").click(function(){
    get_noticias();
    abrir_form_notificaciones();
});


$("#btnarrendatarios_main").click(function(){
     window.open("https://www.simiinmobiliarias.com/base/simired/simidocs/index.php?inmo=704&tipo=2","_blank");
});

$("#btnpropietarios_main").click(function(){
     window.open("https://www.simiinmobiliarias.com/base/simired/simidocs/index.php?inmo=704&tipo=1","_blank");
});







$(".btncerrar_vert").click(function(){
     $(".nombre-usuario-registrado").html("");
     localStorage.setItem("idusuario", "");
     localStorage.setItem("passwordusuario", "");
     localStorage.setItem("emailusuario", "");

     $("#codigo_usuario").html("");


     $("#txtemail_registro_update").val("");
     $("#txtnombre_registro_update").val("");
     $("#txtapellido_registro_update").val("");
     $("#txttelefono_registro_update").val("");

     $("#txtidentificacion_registro_update").val("");

     idusuario="";
     tipousuario="";

      $("#contain-log").hide();

      $("#nombre-login").html("");
      $.mobile.changePage("#pagina-login",{transition:transicion,changeHash: true});
     console.log("Cerrar Sesión");

});




function abrir_form_convenios(){
    $.mobile.changePage("#pagina-listado-convenios",{transition:transicion,changeHash: true});
    get_convenios();
}


function abrir_form_inmuebles(){
    $.mobile.changePage("#pagina-listado-inmueble",{transition:transicion,changeHash: true});
    cargar_inmuebles_destacados_api("1",0);
}




function abrir_form_update_usuario(){
    $("#mensajes-galeria").modal("hide");
    if(idusuario!=""){
        $.mobile.changePage("#pagina-registro-update",{transition:transicion,changeHash: true});
    }else{
        $.mobile.changePage("#pagina-login",{transition:transicion,changeHash: true});
    }
}


function abrir_form_ayudas(){
    $.mobile.changePage("#pagina-ayuda",{transition:transicion,changeHash: true});
}


function abrir_form_info_galeria(){
    $.mobile.changePage("#pagina-galeria-inmobiliaria",{transition:transicion,changeHash: true});
}


$("#btn-llamar-agente").click(function(){
    window.open("tel:0376430034","_self");
});


/*
####################################################
*/


/*
FORMULARIO LISTADO INMUEBLES
Autor: ANGEL LIZCANO
Descripcion:  Formulario Listado Inmueble

####################################################
*/

//BOTON INMUEBLE
var tipo_filtro_inmueble="1";
$( "#btninmuebleizq" ).click(function() {
  $("#btninmuebleizq").addClass("btn-filtro-tipo-activo");
  $("#btninmuebleder").removeClass("btn-filtro-tipo-activo");
  tipo_filtro_inmueble="1";
  cargar_inmuebles_destacados_api("0",0);

});

$( "#btninmuebleder" ).click(function() {
  $("#btninmuebleder").addClass("btn-filtro-tipo-activo");
  $("#btninmuebleizq").removeClass("btn-filtro-tipo-activo");
  tipo_filtro_inmueble="5";
  cargar_inmuebles_destacados_api("0",0);
});


//TIPO LISTADO

var tipo_listado_inmueble="1";
var band_map_exist=1;
$( "#btnlocalizadorinmueble" ).click(function() {
  $("#btnlocalizadorinmueble").addClass("btn-filtro-tipo-activo");
  $("#btnlistadoinmueble").removeClass("btn-filtro-tipo-activo");
  tipo_listado_inmueble="1";
  $("#mapa-inmuebles").show();
  
  /*if(band_map_exist==1){
    cargar_mapa();
  }*/
  

});

$( "#btnlistadoinmueble" ).click(function() {
  $("#btnlistadoinmueble").addClass("btn-filtro-tipo-activo");
  $("#btnlocalizadorinmueble").removeClass("btn-filtro-tipo-activo");
  tipo_listado_inmueble="2";
  $("#mapa-inmuebles").hide();
});

//BOTON DE INMUEBLE FAVORITO






var dato_inmueble=Object();
 var ruta_inmueble="";

 var codigo_inmueble_sel="";

function abrir_form_detalleinmueble(id_inmueble){  

  codigo_inmueble_sel=id_inmueble;

  $("#cargando-modal").modal("show");
  $('#cargando-modal').modal({backdrop: 'static',keyboard: false});
  
  /*$.mobile.changePage("#pagina-detalle-inmueble",{transition:transicion,changeHash: true});
  cargar_mapa_individual();*/
   $.ajax({
    url: 'http://simi-api.com/ApiSimiweb/response/v2/inmueble/codInmueble/'+id_inmueble,
    type: 'GET',
    beforeSend: function (xhr) {
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
     },
    'dataType': "html",
    success:function(data)
    {
     
      dato_inmueble=jQuery.parseJSON(data);
      $.mobile.changePage("#pagina-detalle-inmueble",{transition:transicion,changeHash: true});

      var fotos_inmueble=dato_inmueble.fotos;
      video_inmueble_indiv=dato_inmueble.video;

      $("#tipocontrato_indiv").html(dato_inmueble.Gestion);
      $("#tipoinmueble_indiv").html(dato_inmueble.Tipo_Inmueble);
      $("#ciudad_indiv").html(dato_inmueble.ciudad+" "+dato_inmueble.depto);
      $("#barrio_indiv").html(dato_inmueble.barrio);
      $("#codigo_inmueble_indiv").html(""+id_inmueble);
      $("#valor_canon_indiv").html("$"+dato_inmueble.precio);
      $("#administracion_indiv").html("$"+dato_inmueble.Administracion);
      $("#descripcion_inmueble").html(""+dato_inmueble.descripcionlarga);

      $("#cargando-modal").modal("hide");

      if(dato_inmueble.oper=="Arriendo"){
          tipo_oper="1";
      }else{
          tipo_oper="2";
      }

      get_noticias();


      //https://www.galeriainmobiliaria.com.co/apartaestudios-en-arriendo-bucaramanga-cabecera_del_llano-704-4052

      //var ruta_inmueble="https://www.galeriainmobiliaria.com.co/"+limpiar_ruta(dato_inmueble.Tipo_Inmueble,1)+"-en-"+limpiar_ruta(dato_inmueble.Gestion,1)+'-'+limpiar_ruta(dato_inmueble.ciudad,1)+'-'+limpiar_ruta(dato_inmueble.barrio,2)+'-'+id_inmueble;

      ruta_inmueble=encodeURIComponent("https://www.simiinmobiliarias.com/iframeNvo/details_properties.php?dt="+id_inmueble+"&inmo=704&typebox=1&numbox=3&viewtitlesearch=1&titlesearch=Buscador+de+Inuebles&colortitlesearch=FFFFFF&bgtitlesearch=0076BD&secondct=0076BD&primaryc=0076BD&primaryct=ffff&token=nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw");

      console.log("ruta_inmueble => "+ruta_inmueble);
      var cadena_items_inmueble="";

      if(dato_inmueble.AreaConstruida>0){
        cadena_items_inmueble+='<img src="assets/img/boton_area_gris.png" class="icon-item" style="width: 37px;"> ';
        cadena_items_inmueble+='<span class="label-item" style="color:#9c9c9c;  font-size: 16px;  margin-top: 7px;     font-weight: 200; margin-right: 22px;">'+dato_inmueble.AreaConstruida+' mt2</span>';
      }
     
      if(dato_inmueble.alcobas>0){
        cadena_items_inmueble+='<img src="assets/img/boton_habitaciones_gris.png" class="icon-item" style="width: 37px;"> ';
        cadena_items_inmueble+='<span class="label-item" style="color:#9c9c9c;  font-size: 16px; margin-left: 5px; margin-top: 7px;     font-weight: 200; margin-right: 22px;">'+dato_inmueble.alcobas+'</span>';
      }

      if(dato_inmueble.garaje>0){
        cadena_items_inmueble+='<img src="assets/img/boton_parqueadero_gris.png" class="icon-item" style="width: 37px;"> ';
        cadena_items_inmueble+='<span class="label-item" style="color:#9c9c9c; font-size: 16px; margin-left: 5px; margin-top: 7px;     font-weight: 200; margin-right: 22px;">'+dato_inmueble.garaje+'</span>';
      }

      if(dato_inmueble.banos>0){
        cadena_items_inmueble+='<img src="assets/img/boton_banos_gris.png" class="icon-item" style="width: 37px;"> ';
        cadena_items_inmueble+='<span class="label-item" style="color:#9c9c9c; font-size: 16px; margin-left: 5px; margin-top: 7px;     font-weight: 200;">'+dato_inmueble.banos+'</span>';
      }


      $("#items_inmueble_indiv").html(""+cadena_items_inmueble);

      $("#mapa-indivual").hide();
      if(dato_inmueble.latitud!="" && dato_inmueble.longitud!=""){
        $("#mapa-indivual").show();
        cargar_mapa_individual(dato_inmueble.latitud,dato_inmueble.longitud);
      }
      
      
      

      if(video_inmueble_indiv!=""){
        $("#btnvideo").show();
      }else{
        $("#btnvideo").hide();
      }

     
      var cadena_fotos="";
      cadena_fotos+='<div id="myCarousel" class="carousel slide" data-ride="carousel" style="height: 210px; position: relative;">';
      
      cadena_fotos+='<div class="carousel-inner" id="galeria_fotos_inmuebles">';
      for( var i=0; i< fotos_inmueble.length;i++){
        var clase_activo_galeria="";
        if(i==0){
            clase_activo_galeria="active";
        }
        cadena_fotos+='<div class="item '+clase_activo_galeria+'" style="width: 100%; height: 210px;background-image:url('+fotos_inmueble[i].foto+'); background-position:center; background-size:cover;"></div>';
      }
      cadena_fotos+='</div>';
      cadena_fotos+='<a class="left carousel-control" href="#myCarousel" data-slide="prev">';
      cadena_fotos+='<div style="width:30px; height:30px;     margin-top: 97px; margin-left: 12px; background-image:url(assets/img/slider_izquierda.png); background-position:center; background-repeat:no-repeat;"></div>';
      cadena_fotos+='<span class="sr-only">Previous</span>';
      cadena_fotos+='</a>';
      cadena_fotos+='<a class="right carousel-control" href="#myCarousel" data-slide="next">';
      cadena_fotos+='<div style="width:30px; height:30px;     margin-top: 97px; margin-right: 12px; background-image:url(assets/img/slider_derecha.png); background-position:center; background-repeat:no-repeat;"></div>';
      cadena_fotos+='<span class="sr-only">Next</span>';
      cadena_fotos+='</a>';
      cadena_fotos+=' </div>';

      $("#content_slider").html(cadena_fotos);



    }
        
    });
}


function limpiar_ruta(rut,tip){
  var resultado="";
  rut=rut.toLowerCase();
  for(var i=0;i<rut.length;i++){
     resultado+=get_char(rut.charAt(i),tip);
  } 
  return resultado;
}


function compartir_tipo(tip){
   var cadena_compartir=""; 


   /*

    $url_share_email="{$ruta_external}mailto:?subject={$tituloPagina}&body={$url_compartir}";
    $url_share_facebook="{$ruta_external}http://www.facebook.com/sharer/sharer.php?u=".urlencode($url_compartir)."&p[title]=".$tituloPagina." &p[summary]=".$cadena_compartir."&p[images][0]=$url_imagen_face";
    $url_share_twitter="{$ruta_external}http://twitter.com/home?status=".urlencode($cadena_compartir."...  $url_compartir ");
    $url_share_google="{$ruta_external}https://plus.google.com/share?url="."$url_compartir";
    $url_share_whatsapp="{$ruta_external}https://api.whatsapp.com/send?text=".$cadena_compartir."  $url_compartir";
    $url_share_email="{$ruta_external}mailto:?subject=$tituloPagina &body=".$descripcion_small.". $url_compartir";
    $url_share_pinterest="{$ruta_external}http://pinterest.com/pin/create/button/?url={$url_compartir}&media={$url_imagen_face}&description={$descripcion_small}";
    $url_share_linkedin="{$ruta_external}https://www.linkedin.com/shareArticle?mini=true&url={$url_compartir}&title={$tituloPagina}&summary={$descripcion_small}&source=";
  
  */

   if(tip=="1"){//whatsapp
      cadena_compartir="https://api.whatsapp.com/send?text="+ruta_inmueble;
   }
   if(tip=="2"){//whatsapp
      cadena_compartir="mailto:?subject=Inmueble Galeria&body="+ruta_inmueble;
   }

   if(tip=="3"){//whatsapp
      cadena_compartir="http://www.facebook.com/sharer/sharer.php?u="+ruta_inmueble;
   }

   if(tip=="4"){//whatsapp
      cadena_compartir="http://twitter.com/home?status="+ruta_inmueble;
   }

   if(tip=="5"){//whatsapp
      cadena_compartir="https://plus.google.com/share?url="+ruta_inmueble;
   }

   window.open(""+cadena_compartir,'_system');
}


 function get_char(caracter,tip){
      var _char="";
      var buscar = new Array('#','@','.','+','<','/','Ñ','ñ','(',')','?','¿','"',':','á','é','í','ó','ú','Á','É','Í','Ó','Ú',',','%','!','¡',' ');
      for(var i =0 ;i<buscar.length;i++){
        if(caracter==""+buscar[i]){
          _char=""+buscar[i];
        }
        if(caracter.trim()==""){
          if(tip==1){
              _char="-";
          }else{
            _char="_";
          }
          
        }
      }
      if(_char==""){
        _char=""+caracter;
      }
      return _char;
  }


$(".btnmenu,.btn-menu-vertical").click(function(){
  abrir_menu_movil();
});

$(".btnmenu-back").click(function(){
  abrir_menu_movil();
});

var contador=1;
    function abrir_menu_movil(){

      if(contador==1){
        contador=0;
        $(".cnvmenu").animate({
          left:"0"
        });

        $("#icono_menu").removeClass("fa-bars");
        $("#icono_menu").addClass("fa-times");

      }else{
        contador=1;
        $(".cnvmenu").animate({
          left:"-100%"
        });

        $("#icono_menu").addClass("fa-bars");
        $("#icono_menu").removeClass("fa-times");
      }

    }


function cargar_mapa(lat,long){

  
  $("#mapa-inmuebles").html("");

  band_map_exist=0;

  var myLatLng;
        
    var myLatLng = new google.maps.LatLng(lat,long);

        var mapProp = {

        center:myLatLng,
        zoom:zoom_mapa,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map=new google.maps.Map(document.getElementById("mapa-inmuebles"),mapProp);


  for(var k in datos_inmuebles_listado) {
    if(k<10){
      var myLatLng = new google.maps.LatLng(parseFloat(datos_inmuebles_listado[k].latitud), parseFloat(datos_inmuebles_listado[k].longitud));
      var beachMarker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon:"assets/img/localizador.png",
          
          title: ''+datos_inmuebles_listado[k].Codigo_Inmueble
      });

      beachMarker.Codigo_Inmueble=""+datos_inmuebles_listado[k].Codigo_Inmueble;

      beachMarker.addListener('click', function(e) {
          abrir_form_detalleinmueble(this.Codigo_Inmueble);
      });
    }
  }


 $('html, body').animate({
    scrollTop: $("#listado-imuebles").offset().top-80
 }, 1000);


}



/*
####################################################
*/


/*
FORMULARIO DETALLE INMUEBLES
Autor: ANGEL LIZCANO
Descripcion:  Formulario DETALLE Inmueble



inmo=704
typebox=1
numbox=3
viewtitlesearch=1
titlesearch=Buscador%20de%20Inuebles
colortitlesearch=FFFFFF
bgtitlesearch=0076BD
secondct=0076BD
primaryc=0076BD
primaryct=ffff
token=nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw

####################################################
*/


//tel de agentes inmobiliarios
var arra_telefono=["3202358382","123456"]; 


function abrir_modal(){
   $("#compartir-inmueble").modal("show");
}

$( "#btn-favorito" ).click(function() {
    $("#btn-favorito").addClass("btnfavorito-activo");
});

$( "#btncompartir_detalle" ).click(function() {
    get_codigo_inmueble(codigo_inmueble_sel);

});


var url_compartir_inmueble="";

function get_codigo_inmueble(codigo_inmueble){
  var request = $.ajax({
    url: "http://ec2-18-191-185-90.us-east-2.compute.amazonaws.com/get_url_share_app.php",
    type: "POST",
    data: {
            codigo_simi:""+codigo_inmueble
          }
    });

    request.done(function(msg) {    
      url_compartir_inmueble=msg;
      ruta_inmueble=url_compartir_inmueble;
      $("#compartir-inmueble").modal("show");

  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });
}







$(".btncompartir_listado").click(function() {
   abrir_modal();
});



function abrir_compartir_listado(cod_inmueble){
  get_codigo_inmueble(cod_inmueble);
  //ruta_inmueble=encodeURIComponent("https://www.simiinmobiliarias.com/iframeNvo/details_properties.php?dt="+cod_inmueble+"&inmo=704&typebox=1&numbox=3&viewtitlesearch=1&titlesearch=Buscador+de+Inuebles&colortitlesearch=FFFFFF&bgtitlesearch=0076BD&secondct=0076BD&primaryc=0076BD&primaryct=ffff&token=nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw");
  //abrir_modal();
}






var datos_tipo_apto=new Object();

function cargar_tipo_aptos(){
  $.ajax({
    url: 'http://simi-api.com/ApiSimiweb/response/tipoInmuebles/unique/1',
    type: 'GET',
    beforeSend: function (xhr) {
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
     },
    'dataType': "html",
    success:function(data)
    {
      
      
      var cadena_tipoinmb="";
      cadena_tipoinmb+='<option value="0">.::Tipo Inmueble::.</option>';
      datos_tipo_apto=jQuery.parseJSON(data);
      for(var i=0;i<datos_tipo_apto.length;i++){
         cadena_tipoinmb+='<option value="'+datos_tipo_apto[i].idTipoInm+'">'+datos_tipo_apto[i].Nombre+'</option>';
      }

      $("#tipoinmueble_filtro_inmueble").html(cadena_tipoinmb);

      cargar_deptos_inmuebles();

    }
        
    });
}





var datos_depto=new Object();

function cargar_deptos_inmuebles(){
  $.ajax({
    url: 'http://simi-api.com/ApiSimiweb/response/v2/departamento/unique/1',
    type: 'GET',
    beforeSend: function (xhr) {
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
     },
    'dataType': "html",
    success:function(data)
    {
      
      
      var cadena_depto="";
      cadena_depto+='<option value="0">.::Departamento::.</option>';
      datos_depto=jQuery.parseJSON(data);
      for(var i=0;i<datos_depto.length;i++){
         cadena_depto+='<option value="'+datos_depto[i].id+'">'+datos_depto[i].nombre+'</option>';
      }

      $("#depto_filtro_inmueble").html(cadena_depto);
      //$('#depto_filtro_inmueble').selectmenu('refresh');

      //cargar_ciudades_bydepto(11009);
    }
        
    });
}

var datos_ciudad=new Object();
function cargar_ciudades_bydepto(iddepto){
  $.ajax({
    url: 'http://simi-api.com/ApiSimiweb/response/v2/ciudad/idDepartamento/'+iddepto,
    type: 'GET',
    beforeSend: function (xhr) {
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
     },
    'dataType': "html",
    success:function(data)
    {
      
      
      var cadena_ciudad="";
      cadena_ciudad+='<option value="0">.::Ciudad::.</option>';
      datos_ciudad=jQuery.parseJSON(data);
      for(var i=0;i<datos_ciudad.length;i++){
         cadena_ciudad+='<option value="'+datos_ciudad[i].id+'">'+datos_ciudad[i].nombre+'</option>';
      }

      $("#ciudad_filtro_inmueble").html(cadena_ciudad);
      //$('#ciudad_filtro_inmueble').selectmenu('refresh');

    }
        
    });
}

var datos_zonas=new Object();
var id_ciudad_sel="";
function cargar_zonas_byciudad(idciudad){



  $.ajax({
    url: 'http://simi-api.com/ApiSimiweb/response/v2/zonas/idCiudad/'+idciudad,
    type: 'GET',
    beforeSend: function (xhr) {
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
     },
    'dataType': "html",
    success:function(data)
    {
      
      
      var cadena_zonas="";
      cadena_zonas+='<option value="0">.::Zonas::.</option>';
      datos_zonas=jQuery.parseJSON(data);
      for(var i=0;i<datos_zonas.length;i++){
         cadena_zonas+='<option value="'+datos_zonas[i].id+'">'+datos_zonas[i].nombre+'</option>';
      }

      $("#zona_filtro_inmueble").html(cadena_zonas);

      //$('#zona_filtro_inmueble').selectmenu('refresh');


      id_ciudad_sel=idciudad;
      cargar_barrios_byzonas(0);

    }
        
    });
}


var datos_barrios=new Object();
function cargar_barrios_byzonas(idzona){

  var id_cid=""+id_ciudad_sel;




  $.ajax({
    url: 'http://simi-api.com/ApiSimiweb/response/v2/barrios/idCiudad/'+id_cid+'/idZona/'+idzona,
    type: 'GET',
    beforeSend: function (xhr) {
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
     },
    'dataType': "html",
    success:function(data)
    {
      
      
      var cadena_barrios="";
      cadena_barrios+='<option value="0">.::Barrio::.</option>';
      datos_barrios=jQuery.parseJSON(data);
      for(var i=0;i<datos_barrios.length;i++){
         cadena_barrios+='<option value="'+datos_barrios[i].id+'">'+datos_barrios[i].nombre+'</option>';
      }

      $("#barrios_filtro_inmueble").html(cadena_barrios);
     // $('#barrios_filtro_inmueble').selectmenu('refresh');

    }
        
    });
}




$("#btnbuscarinmueble").click(function(){
  cargar_inmuebles_destacados_api("0",0);   
});


var datos_inmuebles_listado=Object();

 var cadena_inmuebles="";

function cargar_inmuebles_destacados_api(tip,pag){

    var operador_filtro_inmueble=""+$("#operador_filtro_inmueble").val();
    var depto_filtro_inmueble=""+$("#depto_filtro_inmueble").val();
    var ciudad_filtro_inmueble=""+$("#ciudad_filtro_inmueble").val();
    var zona_filtro_inmueble=""+$("#zona_filtro_inmueble").val();
    var barrios_filtro_inmueble=""+$("#barrios_filtro_inmueble").val();
    var tipoinmueble_filtro_inmueble=""+$("#tipoinmueble_filtro_inmueble").val();
    var preciominimo_filtro_inmueble=""+$("#preciominimo_filtro_inmueble").val();
    var preciomaximo_filtro_inmueble=""+$("#preciomaximo_filtro_inmueble").val();
    var habitaciones_filtro_inmueble=""+$("#habitaciones_filtro_inmueble").val();
    var banos_filtro_inmueble=""+$("#banos_filtro_inmueble").val();
    var garaje_filtro_inmueble=""+$("#garaje_filtro_inmueble").val();
    var txtbuscarinmueble=""+$("#txtbuscarinmueble").val();

    



    if(depto_filtro_inmueble=="" || ""+depto_filtro_inmueble=="null"){
      depto_filtro_inmueble="0";
    }

    if(ciudad_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      ciudad_filtro_inmueble="0";
    }

    if(zona_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      zona_filtro_inmueble="0";
    }

    if(barrios_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      barrios_filtro_inmueble="0";
    }

    if(""+tipoinmueble_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      tipoinmueble_filtro_inmueble="0";
    }

    if(preciominimo_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      preciominimo_filtro_inmueble="0";
    }

    if(preciomaximo_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      preciomaximo_filtro_inmueble="0";
    }

    if(habitaciones_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      habitaciones_filtro_inmueble="0";
    }

    if(garaje_filtro_inmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      garaje_filtro_inmueble="0";
    }


    var cadena_filtro="";
    
    if(txtbuscarinmueble=="" || ""+ciudad_filtro_inmueble=="null"){
      txtbuscarinmueble="";

      cadena_filtro+="limite/"+pag+"/";
      cadena_filtro+="cantidad/10/";


    }else{

      cadena_filtro+="limite/"+pag+"/";
      cadena_filtro+="cantidad/100000/";

    }


   
    

    operador_filtro_inmueble=""+tipo_filtro_inmueble;
    
    
    cadena_filtro+="departamento/"+depto_filtro_inmueble+"/";
    cadena_filtro+="ciudad/"+ciudad_filtro_inmueble+"/";
    cadena_filtro+="zona/"+zona_filtro_inmueble+"/";
    cadena_filtro+="barrio/"+barrios_filtro_inmueble+"/";
    cadena_filtro+="tipoInm/"+tipoinmueble_filtro_inmueble+"/";
    cadena_filtro+="tipOper/"+operador_filtro_inmueble+"/";
    cadena_filtro+="areamin/0/";
    cadena_filtro+="areamax/0/";
    cadena_filtro+="valmin/"+preciominimo_filtro_inmueble+"/";
    cadena_filtro+="valmax/"+preciomaximo_filtro_inmueble+"/";
    cadena_filtro+="campo/fecha/";
    cadena_filtro+="order/desc/";
    cadena_filtro+="banios/"+banos_filtro_inmueble+"/";
    cadena_filtro+="alcobas/"+habitaciones_filtro_inmueble+"/";
    cadena_filtro+="garajes/"+garaje_filtro_inmueble+"/";

    $("#cargando-modal").modal("show");
    $('#cargando-modal').modal({backdrop: 'static',keyboard: false});
  
   
    var cadena_filtros='http://simi-api.com/ApiSimiweb/response/v21/filtroInmueble/'+cadena_filtro;

    

    $.ajax({
      url: 'http://simi-api.com/ApiSimiweb/response/v21/filtroInmueble/'+cadena_filtro,
      type: 'GET',
      beforeSend: function (xhr) {
      xhr.setRequestHeader(
        'Authorization',
        'Basic ' + btoa('Authorization:nfeQK4vGWkbX8sPB3Xgoza93tAa9DpGE7kuaHVAw-704'));
       },
      'dataType': "html",
      success:function(data){



          datos_inmuebles_listado=jQuery.parseJSON(data);

          console.log(data);

          if(data=='"Sin resultados"'){
            $("#listado-imuebles").html("<center><h2>Sin resultados</h2></center>");
            $("#cargando-modal").modal("hide");
            return;
          }
          

          var inicio_paginacion=0;
          var fin_paginacion=0;
          var pagina_actual=0;
          var total_inmuebles=0;



          cadena_inmuebles="";
          for(var k in datos_inmuebles_listado) {

              if(k<10){


                if(txtbuscarinmueble!=""){
                   if(txtbuscarinmueble!=""+datos_inmuebles_listado[k].Codigo_Inmueble){
                       continue;
                   }
                }

                var valor_inm="0";
                if(parseFloat(datos_inmuebles_listado[k].Venta)>0){
                   valor_inm=""+datos_inmuebles_listado[k].Venta;
                }else{
                   valor_inm=""+datos_inmuebles_listado[k].Canon;
                }

                if(""+datos_inmuebles_listado[k].idEstado!="2"){
                    continue;
                }

                if(""+datos_inmuebles_listado[k].foto1==""){
                    continue;
                }

                cadena_inmuebles+='<div class="item-menu">';
                cadena_inmuebles+='<div class="image-item-menu" style="background-image: url('+datos_inmuebles_listado[k].foto1+'); " onclick="abrir_form_detalleinmueble(&#39;'+datos_inmuebles_listado[k].Codigo_Inmueble+'&#39;)">';
                cadena_inmuebles+='<div class="container" style="padding: 0px;">';
                cadena_inmuebles+='<div class="row" style="padding: 0px;">';
                cadena_inmuebles+='<div class="col-xs-6">';
                
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='<div class="col-xs-6">';
                cadena_inmuebles+='<div class="precio-inmueble">';
                cadena_inmuebles+='<h5 style="margin: 0px; padding: 0px;     font-size: 11px;  font-weight: bold;">'+datos_inmuebles_listado[k].Gestion+'</h5>';
                cadena_inmuebles+='<h4 style="margin: 0px; padding: 0px;     font-size: 18px;  font-weight: bold;">$'+valor_inm+'</h4>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='<div class="footer-item">';

                if(datos_inmuebles_listado[k].AreaConstruida>0){
                  cadena_inmuebles+='<img src="assets/img/boton_area.png" class="icon-item"> ';
                  cadena_inmuebles+='<span class="label-item">'+datos_inmuebles_listado[k].AreaConstruida+' m2</span>';
                }

                if(datos_inmuebles_listado[k].Alcobas>0){
                  cadena_inmuebles+='<img src="assets/img/boton_habitaciones.png" class="icon-item">';
                  cadena_inmuebles+='<span class="label-item">'+datos_inmuebles_listado[k].Alcobas+'</span>';
                }

                if(datos_inmuebles_listado[k].garaje>0){
                  cadena_inmuebles+='<img src="assets/img/boton_parqueadero.png" class="icon-item"> ';
                  cadena_inmuebles+='<span class="label-item">'+datos_inmuebles_listado[k].garaje+'</span>';
                }

                if(datos_inmuebles_listado[k].banios>0){
                  cadena_inmuebles+='<img src="assets/img/boton_banos.png" class="icon-item"> ';
                  cadena_inmuebles+='<span class="label-item">'+datos_inmuebles_listado[k].banios+'</span>';
                }

                

                cadena_inmuebles+='</div>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+=' <div class="info-item-menu" >';
                cadena_inmuebles+='<div class="container" style="padding: 0px;" >';
                cadena_inmuebles+='<div class="col-xs-10" style="padding: 0px;" onclick="abrir_form_detalleinmueble(&#39;'+datos_inmuebles_listado[k].Codigo_Inmueble+'&#39;)">';
                cadena_inmuebles+='<h5 class="titulo-item-menu">'+datos_inmuebles_listado[k].Tipo_Inmueble+' / '+datos_inmuebles_listado[k].Ciudad+'</h5>';
                cadena_inmuebles+='<p class="subtitulo-item-menu">'+datos_inmuebles_listado[k].Barrio+'</p>';
                cadena_inmuebles+='<p class="codigo-item-menu">Código: '+datos_inmuebles_listado[k].Codigo_Inmueble+'</p>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='<div class="col-xs-2" style="padding: 0px;">';
                /*cadena_inmuebles+='<a href="javascript:abrir_compartir_listado(&#39;'+datos_inmuebles_listado[k].Codigo_Inmueble+'&#39;)" style="float: right; "  class="" >';
                cadena_inmuebles+='<img src="assets/img/boton_compartir.png" class="icon-compartir"> ';
                cadena_inmuebles+='</a>';*/
                cadena_inmuebles+='</div>';
                cadena_inmuebles+=' </div>';
                cadena_inmuebles+='</div>';
                cadena_inmuebles+='</div>';

              }else{
                 /*
                inicio_paginacion=0;
                fin_paginacion=0;
                pagina_actual=0;
                total_inmuebles=0;
                 */

                 if(k=="inicio"){
                    inicio_paginacion=datos_inmuebles_listado[k];
                 }

                 if(k=="fin"){
                    fin_paginacion=datos_inmuebles_listado[k];
                 }

                 if(k=="pagina_actual"){
                    pagina_actual=datos_inmuebles_listado[k];
                 }

                 if(k=="totalInmuebles"){
                    total_inmuebles=datos_inmuebles_listado[k];
                 }




              }



              
              
          }


          $("#cargando-modal").modal("hide");


          if(txtbuscarinmueble=="" || ""+ciudad_filtro_inmueble=="null"){
            
             $('#pagination-demo').pagination({
              items: total_inmuebles,
              itemOnPage: 10,
              currentPage: pagina_actual,
              cssStyle: '',
              prevText: '<span aria-hidden="true">&laquo;</span>',
              nextText: '<span aria-hidden="true">&raquo;</span>',
              onInit: function () {
                  // fire first page loading
              },
              onPageClick: function (page, evt) {
                  // some code
                  cargar_inmuebles_destacados_api("0",page);
              }

          });


          }else{

             $('#pagination-demo').html("");

          }


          


          $("#listado-imuebles").html(cadena_inmuebles);

          cargar_mapa(datos_inmuebles_listado[0].latitud,datos_inmuebles_listado[0].longitud);

          $('html, body').animate({
                scrollTop: $("#listado-imuebles").offset().top-80
            }, 1000);



      }
          
      });
}


function cargar_mapa_individual(lat,long){

  
  var myLatLng;
        
    var myLatLng = new google.maps.LatLng(lat,long);

        var mapProp = {

        center:myLatLng,
        zoom:zoom_mapa,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map=new google.maps.Map(document.getElementById("mapa-indivual"),mapProp);

     
      var beachMarker;
      
      beachMarker = new google.maps.Marker({
          position: myLatLng,
          map: map,  
          icon:"assets/img/localizador.png",
          title: ''
      });
}





function abrir_form_notificaciones(){
   $.mobile.changePage("#pagina-listado-notificaciones",{transition:transicion,changeHash: true});
   get_noticias();
}

$(".btnnotificaciones").click(function(){
    abrir_form_notificaciones();
});


var obj_asesores=new Object();
var obj_categorias=new Object();

var tipo_oper="1";
function get_noticias(){
   var request = $.ajax({
    url: servidor_ws+"/get_notificaciones.php",
    type: "POST",
    data: {            
            idusuario:"1",
            tipoasesor:""+tipo_oper

          }
    });

  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){
          
          var objdata=msg.datos;
          obj_asesores=msg.asesores;
          obj_categorias=msg.categorias;

          var cadena_cat="";
          cadena_cat+='<option value="">Todos</option>';
          for(var i=0;i<obj_categorias.length;i++){
            cadena_cat+='<option value="'+obj_categorias[i].IdCategoriabeneficio+'">'+obj_categorias[i].NombreCategoria+'</option>';
          }
          $("#txtcategoria").html(cadena_cat);
          //$("#txtcategoria").selectmenu("refresh");

          getWhatsapp();

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

          var cadena_asesores="";
          for(var i=0;i<obj_asesores.length;i++){
            
            cadena_asesores+='<div style="padding-top: 15px; padding-bottom: 15px; margin-bottom:10px; width: 100%; border: 1px solid #ccc; border-radius: 8px; text-align: center; background-position: center; background-size: cover; padding-left: 5px; padding-right: 5px; background-color: #fff;">';
            cadena_asesores+='<div style="width: 100%;  height: 300px; margin-bottom: 10px; background-position: center; background-size: cover; background-repeat: no-repeat; background-image: url('+servidor_ws+'/images/asesores/'+obj_asesores[i].imagenasesor+')">';
            cadena_asesores+='</div> ';
            cadena_asesores+='<h3>'+obj_asesores[i].nombreAsesor+'</h3>';
            cadena_asesores+='<a class="btn btn-default" href="javascript:abrir_whatsapp_inmueble('+obj_asesores[i].whatsappAsesor+')" style="width: 100%; margin-bottom: 10px;">';
            cadena_asesores+='<strong>WhatsApp:</strong> '+obj_asesores[i].whatsappAsesor+'';
            cadena_asesores+='</a>';
            cadena_asesores+='<a class="btn btn-default" href="tel:'+obj_asesores[i].whatsappAsesor+'" style="width: 100%; margin-bottom: 10px;">';
            cadena_asesores+='<strong>Llamar:</strong> '+obj_asesores[i].whatsappAsesor+'';
            cadena_asesores+='</a>';
            cadena_asesores+='<a class="btn btn-default" href="mailto:'+obj_asesores[i].emailAsesor+'" style="width: 100%; margin-bottom: 10px; font-size: 12px;">';
            cadena_asesores+='<strong>Email:</strong> '+obj_asesores[i].emailAsesor+'';
            cadena_asesores+='</a>';


            if(obj_asesores[i].urlAsesor!=""){

            
              cadena_asesores+='<a class="btn btn-default" href="javascript:abrir_tarjeta_asesor(&#39;'+obj_asesores[i].urlAsesor+'&#39;)" style="width: 100%; margin-bottom: 10px;">';
              cadena_asesores+='<strong>Ver Tarjeta</strong>';
              cadena_asesores+='</a>';

            }

            
            cadena_asesores+='</div>';
            
           
          }
     

          $("#lt_asesores").html(cadena_asesores);

          $("#listado-noticias").html(cadena_noticias);

      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });
}

function abrir_whatsapp_inmueble(num_wha){
  window.open("https://api.whatsapp.com/send?phone=57"+num_wha+"&text=Hola%20me%20podrías%20dar%20más%20información%20acerca%20del%20inmueble%20con%20código%20"+codigo_inmueble_sel,'_system');
}


function abrir_tarjeta_asesor(url){
  window.open(url,'_system');
}


function get_noticias_detalle(idnoticia){
   var request = $.ajax({
    url: servidor_ws+"/get_notificaciones.php",
    type: "POST",
    data: {            
            idnoticia:""+idnoticia
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){
          
          var objdata=msg.datos;

          var descripcionNoticia="";
          var tituloNoticia="";
          var tipoNoticia="";
          var fechaNoticia="";


          for(var i=0; i<objdata.length; i++){
             tituloNoticia=""+objdata[i].tituloNoticia;
             descripcionNoticia=""+objdata[i].descripcionNoticia;
             fechaNoticia=""+objdata[i].fechaNoticia;
             tipoNoticia=""+objdata[i].tipoNoticia;
          }

          if(tipoNoticia=="1"){
              abrir_mensajes(""+tituloNoticia,""+descripcionNoticia+"<br /><br /> <i>"+fechaNoticia+"</i>");
          }
          



      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });
}




/*
####################################################
*/


/*
FORMULARIO DETALLE INMUEBLES
Autor: ANGEL LIZCANO
Descripcion:  Formulario DETALLE Inmueble

*/

$(".btncontacto").click(function(){
  abrir_pagina_contacto();  
});

function abrir_pagina_contacto(){   
   $.mobile.changePage("#pagina-contacto",{transition:transicion,changeHash: true});

   var myLatLng;
        
    var myLatLng = new google.maps.LatLng(7.1178107,-73.109099);

        var mapProp = {

        center:myLatLng,
        zoom:zoom_mapa,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map=new google.maps.Map(document.getElementById("mapa-galeria"),mapProp);

     
      var beachMarker;
      
      beachMarker = new google.maps.Marker({
          position: myLatLng,
          map: map,              
          title: ''
      });
}


$("#frmbuscaravanzado").submit(function( event ) {
    event.preventDefault();
     cargar_inmuebles_destacados_api("0",0); 
});



$( "#form-contacto" ).submit(function( event ) {
  event.preventDefault();
     enviar_mensaje();
});

var txtemail_contacto="";
var txtnombre_contacto="";
var txtmensaje_contacto="";
var txttelefono_contacto="";

function enviar_mensaje(){

  txtemail_contacto=""+$("#txtemail_contacto").val();
  txtnombre_contacto=""+$("#txtnombre_contacto").val();
  txtmensaje_contacto=""+$("#txtmensaje_contacto").val();
  txttelefono_contacto=""+$("#txttelefono_contacto").val();


  var request = $.ajax({
    url: servidor_ws+"/enviar_mensaje_app.php",
    type: "POST",
    data: {            
            txtemail_contacto:""+txtemail_contacto,
            txtnombre_contacto:""+txtnombre_contacto,
            txtmensaje_contacto:""+txtmensaje_contacto,
            txttelefono_contacto:""+txttelefono_contacto
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){

          abrir_mensajes("Proceso Éxito","El mensaje fue enviado éxitosamente, estaremos en contacto contigo lo más pronto posible");
          

      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });


}



/*
####################################################
*/


/*
FORMULARIO LISTADO CONVENIOS
Autor: ANGEL LIZCANO
Descripcion:  Formulario que lista los diferentes convenios de galeria inmobiliaria

*/


var obj_convenio=new Object();

var favorito_sel="";


$("#btnfavoritolistado").click(function(){
   favorito_sel="SI";
   get_convenios();
});



$("#btnbuscarconvenio").click(function(){
   favorito_sel="";
   get_convenios();
});

function get_convenios(){

  var nombreconvenio=$("#txtbuscarconvenio").val();
  var categoria=$("#txtcategoria").val();
   var request = $.ajax({
    url: servidor_ws+"/get_convenios.php",
    type: "POST",
    data: {            
            idusuario:""+idusuario,
            nombreconvenio:""+nombreconvenio,
            tipousuario:""+tipousuario,
            categoria:""+categoria
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){
          
          
          obj_convenio=msg.datos;

          var cadena_convenios="";

          for(var i=0; i<obj_convenio.length; i++){

              if(favorito_sel=="SI"){
                  if(obj_convenio[i].favorito==""){
                      continue;
                  }
              }

              var foto_convenio="";
              if(obj_convenio[i].imagenCatalogo!=""){
                  foto_convenio=""+servidor_ws+"/convenios/"+obj_convenio[i].imagenCatalogo;
              }
              

              cadena_convenios+='<div class="item-menu">';
              cadena_convenios+='   <div class="image-item-menu" style="background-image: url('+foto_convenio+'); " onclick="abrir_form_detalleconvenio('+obj_convenio[i].IdProducto+','+i+')">';
              cadena_convenios+='     <div class="container" style="padding: 0px;">';
              cadena_convenios+='         <div class="row" style="padding: 0px;">';
              cadena_convenios+='           <div class="col-xs-6">';

              if(obj_convenio[i].favorito!="SI"){
                  cadena_convenios+='          <a href="#" class="btnfavorito"></a>';
              }else{
                  cadena_convenios+='          <a href="#" class="btnfavorito btnfavorito-activo"></a>';
              }
              
              
              cadena_convenios+='           </div>';
              cadena_convenios+='         </div>';
              cadena_convenios+='      </div>';
              cadena_convenios+='   </div>';
              cadena_convenios+='   <div class="info-item-menu" >';
              cadena_convenios+='     <div class="container" style="padding: 0px;" >';
              cadena_convenios+='         <div class="col-xs-12" style="padding: 0px;" onclick="abrir_form_detalleconvenio('+obj_convenio[i].IdProducto+','+i+')">';
              cadena_convenios+='             <p class="subtitulo-item-menu" style="margin-top: 5px; font-weight:bold;">'+obj_convenio[i].nombreProducto+'</p>';
              cadena_convenios+='             <p class="subtitulo-item-menu" style="margin-top: 1px; font-size:14px; ">'+obj_convenio[i].razonsocialFabricante+'</p>';
              cadena_convenios+='             <p class="subtitulo-item-menu" style="margin-top: 1px; font-size:11px; ">'+obj_convenio[i].NombreCategoria+'</p>';
              cadena_convenios+='         </div>';
             
              cadena_convenios+='     </div>';
              cadena_convenios+='   </div>';
              cadena_convenios+='</div>';
             
          } 

          $("#listado-convenios").html(cadena_convenios);

      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });
}


var telefonoconvenio="";
var idproducto="";
var favorito_convenio="";





function abrir_form_detalleconvenio(idconvenio, indice){

    if(tipousuario=="0"){
        abrir_mensajes("Error",'No estás registrado en Galería Inmobiliaria, ¿Deseas ser parte de Galería  Inmobiliaria? <br> <br> <button class="btn-amarillo btningresar_mensaje" onclick="abrir_form_update_usuario()" >INGRESAR</button> ');
        return;
    }

    $.mobile.changePage("#pagina-detalle-convenio",{transition:transicion,changeHash: true});
    var imagen_convenio=""+servidor_ws+"/convenios/"+obj_convenio[indice].imagenCatalogo;
    var imagen_convenio2=""+servidor_ws+"/convenios/"+obj_convenio[indice].imagenCatalogo2;
    var imagen_convenio3=""+servidor_ws+"/convenios/"+obj_convenio[indice].imagenCatalogo3;
    var imagen_convenio4=""+servidor_ws+"/convenios/"+obj_convenio[indice].imagenCatalogo4;

    var titulo_convenio=""+obj_convenio[indice].nombreProducto;
    var no_convenio=""+obj_convenio[indice].IdProducto;
    var descripcion_convenio=""+obj_convenio[indice].descripcionProducto;
    var promocion_convenio=""+obj_convenio[indice].promocionProducto;
    var direccion_convenio=""+obj_convenio[indice].direccionFabricante;
    telefonoconvenio=""+obj_convenio[indice].telefonosFabricante;
    favorito_convenio=""+obj_convenio[indice].favorito;

    if(favorito_convenio=="SI"){
       
        $("#btn-favorito-convenio").addClass("btnfavorito-activo");
    }else{
        $("#btn-favorito-convenio").removeClass("btnfavorito-activo");
    }

    idproducto=""+obj_convenio[indice].IdProducto;

    $("#galeria-convenio-detalle").css("background-image","url("+imagen_convenio+")"); 


    var cadena_fotos="";
    cadena_fotos+='<div style="display:inline-block; margin-right:4%;  width:20%; height:60px; border-radius:5px;  background-image:url('+imagen_convenio+'); background-size:cover; background-position:center;cursor:pointer;" onclick="cambioimagen(&#39;'+imagen_convenio+'&#39;)"></div>';

    if(obj_convenio[indice].imagenCatalogo2!="" && obj_convenio[indice].imagenCatalogo2!=undefined){
      cadena_fotos+='<div style="display:inline-block; margin-right:4%;  width:20%; height:60px; border-radius:5px;  background-image:url('+imagen_convenio2+'); background-size:cover; background-position:center;cursor:pointer;" onclick="cambioimagen(&#39;'+imagen_convenio2+'&#39;)"></div>';
    }    
    if(obj_convenio[indice].imagenCatalogo3!=""  && obj_convenio[indice].imagenCatalogo3!=undefined){
      cadena_fotos+='<div style="display:inline-block; margin-right:4%;  width:20%; height:60px; border-radius:5px;  background-image:url('+imagen_convenio3+'); background-size:cover; background-position:center;cursor:pointer;" onclick="cambioimagen(&#39;'+imagen_convenio3+'&#39;)"></div>';
    }
    if(obj_convenio[indice].imagenCatalogo4!=""  && obj_convenio[indice].imagenCatalogo4!=undefined){
      cadena_fotos+='<div style="display:inline-block; margin-right:4%;  width:20%; height:60px; border-radius:5px;  background-image:url('+imagen_convenio4+'); background-size:cover; background-position:center;cursor:pointer;" onclick="cambioimagen(&#39;'+imagen_convenio4+'&#39;)"></div>';
    }

    $("#listado_fotos_convenios").html(cadena_fotos);

    $("#detalle_nombre_convenio").html(titulo_convenio);
    $(".no_convenio").html(""+no_convenio);
    $("#descripcion_convenio").html(""+descripcion_convenio);
    $("#precio_convenio").html(""+promocion_convenio);
    $("#direccion-convenio").html(""+direccion_convenio);    

    
    var ruta_qr=servidor_ws+"/qr_convenio.php?idconvenio="+idproducto+"&idusuario="+idusuario;

    $("#qrconvenio").html('<img src="'+ruta_qr+'" style="width:100%;" >');


    $("#mapa-indivual-convenio").hide();

    if(""+obj_convenio[indice].latitudFabricante!="" && ""+obj_convenio[indice].longitudFabricante!=""){
        $("#mapa-indivual-convenio").show();
        cargar_mapa_convenio(obj_convenio[indice].latitudFabricante,obj_convenio[indice].longitudFabricante);
    }
    
}

function cambioimagen(imagen_convenio){
   $("#galeria-convenio-detalle").css("background-image","url("+imagen_convenio+")"); 
}



function cargar_mapa_convenio(lat,lang){

  band_map_exist=0;

  var myLatLng;
        
    var myLatLng = new google.maps.LatLng(lat,lang);

        var mapProp = {

        center:myLatLng,
        zoom:zoom_mapa,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map=new google.maps.Map(document.getElementById("mapa-indivual-convenio"),mapProp);

     
      var beachMarker;
      
      beachMarker = new google.maps.Marker({
          position: myLatLng,
          map: map,              
          title: ''
      });
}

$("#btn-llamar-convenio").click(function(){
  ejecutar_telefono_convenio();
});

function ejecutar_telefono_convenio(){
  window.open("tel:"+telefonoconvenio,"_self");
} 


$("#btn-favorito-convenio").click(function(){
  if(favorito_convenio=="SI"){
    convenio_favorito(idusuario,idproducto,0);
  }else{
    convenio_favorito(idusuario,idproducto,1);
  }  
});

function convenio_favorito(idusu,idprod,idestado){

  
 
  var request = $.ajax({
    url: servidor_ws+"/set_favorito_convenio.php",
    type: "POST",
    data: {            
            idusuario:""+idusu,
            idproducto:""+idprod,
            idestado:""+idestado
            
          }
    });


  request.done(function(msg) {            
    //var obj = jQuery.parseJSON(msg);       
      if(msg.status=="ok"){

         if(idestado==1){       
              $("#btn-favorito-convenio").addClass("btnfavorito-activo");
          }else{
              $("#btn-favorito-convenio").removeClass("btnfavorito-activo");
          }

          get_convenios();
          

      }else{
          abrir_mensajes("Error",msg.mensaje);
      }
  });     

    //respuesta si falla
    request.fail(function(jqXHR, textStatus) {
       abrir_mensajes("Error","No se ha podido conectar con el servidor, revise su conexión a internet y pruebe nuevamente.");
    });


}



var tipo_listado_convenio="1";
var band_map_exist2=1;
$( "#btnlocalizadorconvenio" ).click(function() {
  $("#btnlocalizadorconvenio").addClass("btn-filtro-tipo-activo");
  $("#btnlistadoconvenio").removeClass("btn-filtro-tipo-activo");
  tipo_listado_convenio="1";
  $("#mapa-convenios").show();
  
  if(band_map_exist2==1){
    cargar_mapa_convenio_listado();
  }
  

});

$( "#btnlistadoconvenio" ).click(function() {
  $("#btnlistadoconvenio").addClass("btn-filtro-tipo-activo");
  $("#btnlocalizadorconvenio").removeClass("btn-filtro-tipo-activo");
  tipo_listado_convenio="2";
  $("#mapa-convenios").hide();
});





$("#btnbusquedavanzada1").click(function(){
    abrir_form_busqueda_avanzada_inmuebles();  
});


function abrir_form_busqueda_avanzada_inmuebles(){
    $.mobile.changePage("#pagina-busqueda-avanzada-inmuebles",{transition:transicion,changeHash: true});
}


function cargar_mapa_convenio_listado(){

  var myLatLng;
        
    var myLatLng = new google.maps.LatLng(obj_convenio[0].latitudFabricante,obj_convenio[0].longitudFabricante);

        var mapProp = {

        center:myLatLng,
        zoom:zoom_mapa,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map=new google.maps.Map(document.getElementById("mapa-convenios"),mapProp);

     
     for(var i=0;i<obj_convenio.length;i++){

        if(obj_convenio[i].latitudFabricante!="" && obj_convenio[i].longitudFabricante!=""){

          
          var beachMarker;
          var myLatLng2 = new google.maps.LatLng(obj_convenio[i].latitudFabricante,obj_convenio[i].longitudFabricante);
      
          beachMarker = new google.maps.Marker({
              position: myLatLng2,
              icon:"assets/img/localizador.png",
              map: map,              
              title: ''
          });

          beachMarker.codigo_convenio=""+obj_convenio[i].IdProducto;
          beachMarker.indice=i;


          beachMarker.addListener('click', function(e) {              
              abrir_form_detalleconvenio(this.codigo_convenio, this.indice);
          });

          }


     }


      

}



function enviar_tag(idtipusu){
    //window.plugins.OneSignal.sendTag("tipousuario", ""+idtipusu); // android
}
