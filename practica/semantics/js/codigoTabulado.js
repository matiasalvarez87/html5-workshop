$(function() {

	$('a[href="#lista"]').on('show', function (e) {
		// Inicializo la tabla con los datos del local storage
		inicializarTabla();
	});

	$('a[href="#formulario"]').on('show', function (e) {
		// Inicializo el formulario de creacion/edicion de personas
		inicializarFormulario();
	});

	$('a[href="#configuracion"]').on('show', function (e) {
		// Inicializo el formulario de configuracion
		inicializarConfiguracion();
	});

	inicializarTabla();
});