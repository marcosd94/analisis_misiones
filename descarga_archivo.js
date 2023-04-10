
this.misiones_finalizadas = 0;
this.page = 1;
this.misiones_filtradas = [];
this.cantidad = 5;


$(document).ready(function(){
	//this.misiones_finalizadas = 0;	
	$(document).on('click',".ventas_pagination", function(event){
		//abortFetching()
		event.stopPropagation();
		event.stopImmediatePropagation();
		//this.page = $(this).attr('at');
		goToPage($(this).attr('at'));
	});

	oFileInVendedores = document.getElementById('vendedores_clientes');
	if(oFileInVendedores.addEventListener) { 
		oFileInVendedores.addEventListener('change', filePickedVendedores, false);
	}
	$(document).on('click',"#prev", function () {
		//abortFetching()
	//$("#prev").bind('click', function () {
		prev();
    });
	$(document).on('click',"#next", function () {
		//abortFetching()
	//$("#next").bind('click', function () {
		next()
    });
	//$(".img_resolucion").hover(function() {
	$(document).on('mouseenter',".img_resolucion_2", function(event){
	  //$(this).attr('at')
	  var id = $(this).attr('at_img') + "_modal";
	  $('#'+id).css("display", "block")
	}, function() {
	  var id = $(this).attr('at_img') + "_modal";
	  $('#'+id).css("display", "block");	  
	  $('#'+id).removeClass('hide');
	  $('#'+id).addClass('show');
	});
	
	$(document).on('mouseleave',".img_resolucion_2", function(event){
	  //$(this).attr('at')
	  var id = $(this).attr('at_img') + "_modal";
	  $('#'+id).css("display", "block")
	}, function() {
	  var id = $(this).attr('at_img') + "_modal";
	  $('#'+id).css("display", "none");	  
	  $('#'+id).removeClass('show');
	  $('#'+id).addClass('hide');
	});
	$( ".img_resolucion_2" ).hover(
	  function() {
		$( this ).append( $( "<span> ***</span>" ) );
	  }, function() {
		$( this ).find( "span" ).last().remove();
	  }
);
	
	
});




function goToPage(page) {
	$("#li_"+this.page).removeClass('active')
	this.page = page;
	$("#li_"+this.page).addClass('active');
	loadTable(this.page);
}

function prev() {	
	//alert("Actual: "+this.page +", nuevo: "+(this.page-1));
	if(this.page > 1){
		$("#li_"+this.page).removeClass('active')
		this.page--;
		$("#li_"+this.page).addClass('active');
		loadTable(this.page);
	}
}

function next() {	
	//alert("Actual: "+this.page +", nuevo: "+(this.page+1));		
	if(this.page < this.misiones_finalizadas/this.cantidad){
		$("#li_"+this.page).removeClass('active')
		this.page++;	
		$("#li_"+this.page).addClass('active');
		loadTable(this.page);
	}
}
  


	
function filePickedVendedores(oEvent) {
	if(typeof oEvent == 'undefined' ){
		return;
	}
	$.blockUI({ message: '<h2><img src="css/busy.gif" /> Leyendo archivo...</h2>' }); 
	var oFile = oEvent.target.files[0];
	var sFilename = oFile.name;
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		var cfb = XLSX.read(data, {type: 'binary'});
		cfb.SheetNames.forEach(function(sheetName) {
		var sCSV = XLS.utils.make_csv(cfb.Sheets[sheetName]);   
		var oJS = XLS.utils.sheet_to_json(cfb.Sheets[sheetName]);
		misiones = oJS;		
		var x= 0;
		var table = document.getElementById("body_misiones");
		var paginationDom = document.getElementById("pagination_nav");
		var fila = '';
		var pag = '';
		
		for( var i = 0; i < misiones.length; i++){
			if(misiones[i]["ESTADO"].trim() == 'FINALIZADO' 
			&& misiones[i]["URL_IMAGEN_RESOLUCION"] != null  
			&& misiones[i]["URL_IMAGEN_RESOLUCION"] != '' ){
				this.misiones_finalizadas++;
				this.misiones_filtradas.push(misiones[i]);
			}			
		}
		$.unblockUI();
		var salto = 0;
		pag+= '<ul class="pagination text-center" id="pagination" style="margin-bottom: 0.5rem;"><li class="page-item"><a class="page-link" href="#" aria-label="Previous" id="prev"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
		for(var j = 1; j < Math.ceil((misiones_finalizadas/this.cantidad)); j++){
			if(salto == 30){
				pag+= '</ul><ul class="pagination text-center" id="pagination" style="margin-bottom: 0.5rem;">';
				salto = 0;
			
			}
			pag+= '<li class="page-item" id="li_'+j+'"><a class="page-link ventas_pagination" at="'+j+'" href="#">'+j+'</a></li>';
			salto++;
		}
		var pagination = ''
		+ pag
		+ '<li class="page-item"><a class="page-link" href="#" aria-label="Next" id="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li></ul>';
		paginationDom.innerHTML = pagination;
		loadTable(this.page);
		$("#li_1").addClass('active');
	});
	};
	reader.readAsBinaryString(oFile);
}

function loadTable(page){
		abortFetching();
		createControler();
		
		var table = document.getElementById("body_misiones");
		var image_modals = document.getElementById("image_modals");
		var fila = '';
		var modals = '';
		var x = 0;
		var desde = (page-1)*this.cantidad;
		var hasta = page*this.cantidad;
		for( var i = (page-1)*this.cantidad; i < page*this.cantidad; i++){
			if(this.misiones_filtradas[i]["ESTADO"].trim() == 'FINALIZADO' 
			&& this.misiones_filtradas[i]["URL_IMAGEN_RESOLUCION"] != null  
			&& this.misiones_filtradas[i]["URL_IMAGEN_RESOLUCION"] != '' ){
				x++;
				fila += 
					'<tr height=200><th scope="row">'+x+'</th>'
					  +'<td>'+this.misiones_filtradas[i]["ID_EMPLEADO_ASIGNADO"]+'</td>'
					  +'<td>'+this.misiones_filtradas[i]["NOMBRE_EMPLEADO_ASIGNADO"]+'</td>'
					  +'<td>'+this.misiones_filtradas[i]["ID_CLIENTE"]+'</td>'
					  +'<td>'+this.misiones_filtradas[i]["RAZON_SOCIAL_CLIENTE"]+'</td>'
					  +'<td>'+this.misiones_filtradas[i]["FECHA_RESOLUCION"]+'</td>'
					  +'<td class="text-center"><div id="img-contenedor" class="img_resolucion_2" at_img="'+this.misiones_filtradas[i]["ID_DETALLE"]+'"><img id="'+this.misiones_filtradas[i]["ID_DETALLE"]+'" class="img_resolucion" src="css/loading.gif" alt="Click para descargar" border=3 height=25></img></div></td>'
					+'</tr>';
					
					
				modals += '<div class="modal fade" id="'+this.misiones_filtradas[i]["ID_DETALLE"]+'_modal"'+ 
				'tabindex="-1" aria-hidden="true" style="display: none;">' +
				'<div class="modal-dialog modal-lg modal-dialog-centered">'+
				 ' <div class="modal-content">'+
				 '<div class="modal-header">'+
                      '<h6 class="modal-title">'+this.misiones_filtradas[i]["NOMBRE_EMPLEADO_ASIGNADO"]+', '+this.misiones_filtradas[i]["ID_CLIENTE"]+' - '+this.misiones_filtradas[i]["RAZON_SOCIAL_CLIENTE"]+'</h6>'+
                    '</div>'+
					'<div class="modal-body">'+
					'	<img id="'+this.misiones_filtradas[i]["ID_DETALLE"]+'_img_modal" class="img-fluid" src="css/loading.gif" border=3 height=25></img>'+
					'</div>'+
				  '</div>'+
				'</div>'+
			  '</div>';
			}			
		}
		table.innerHTML = fila;
		image_modals.innerHTML = modals;
		for( var i = (page-1)*this.cantidad; i < page*this.cantidad; i++){
			if(this.misiones_filtradas[i]["ESTADO"].trim() == 'FINALIZADO' 
			&& this.misiones_filtradas[i]["URL_IMAGEN_RESOLUCION"] != null  
			&& this.misiones_filtradas[i]["URL_IMAGEN_RESOLUCION"] != '' ){
				descargarDatos(this.misiones_filtradas[i]["ID_DETALLE"],this.misiones_filtradas[i]["URL_IMAGEN_RESOLUCION"]);
			}			
		}

}

	this.controller = new AbortController()
	this.signal = controller.signal

function createControler() {	
	this.controller = new AbortController()
	this.signal = controller.signal
}

function descargarDatos(id,url) {	
	const myImage = document.getElementById(id);
	const modalsImage = document.getElementById(id+"_img_modal");
	fetch(url, {
                method: 'get',
                signal: this.signal,
            }).then((response) => {
	  // for each response header, log an array with header name as key
	  response.blob().then((myBlob) => {
		const objectURL = URL.createObjectURL(myBlob);
		myImage.src = objectURL;
		myImage.height = 200;
		modalsImage.src = objectURL;
		//modalsImage.height = 200;
	  });
	});
}


function next() {	
	//alert("Actual: "+this.page +", nuevo: "+(this.page+1));		
	if(this.page < this.misiones_finalizadas/this.cantidad){
		$("#li_"+this.page).removeClass('active')
		this.page++;	
		$("#li_"+this.page).addClass('active');
		loadTable(this.page);
	}
}

function abortFetching() {
	// Abort.
	this.controller.abort()
}