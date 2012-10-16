$(function() {

	inicializarTabla();

	$('#person-tbody tr').click(function() {
		var personId = $(this).data('person-id');

		// Salvo el id de la persona seleccionada en el Session Storage para pasarlo a la otra vista.
		sessionStorage.setItem('personEdit', personId);
		window.location.href = './form.html'
		
		// Para borrar
		//localStorage.removeItem(personId);
		//$(this).remove();
	});
});