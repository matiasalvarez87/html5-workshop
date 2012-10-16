var StoragePersonas = {

	keyPersonas: 'personas', 

	listarPersonas: function() {
		var personList = [];

		var personasString = localStorage.getItem(this.keyPersonas);

		if (personasString) {
			personList = JSON.parse(personasString);
		}
		return personList;	
	},

	guardarPersona: function(persona) {
		var personList = this.listarPersonas();
		var storedPersona = this.recuperarPersona(persona.document);
		if (storedPersona) {
			// Estoy editando
			var personaIndex = _.indexOf(personList, storedPersona);
			personList[storedPersona] = persona;
		} else {
			// Estoy creando
			personList.push(persona);
		}

		localStorage.setItem(this.keyPersonas, JSON.stringify(personList));
	},

	recuperarPersona: function(personId) {
		var personList = this.listarPersonas();
		var resultList = _.where(personList, {document:personId});
		if (resultList.length == 0) {
			return null;
		} else {
			return resultList[0];
		}
	},

	borrarPersona: function(personId) {
		var personaBorrada = this.recuperarPersona(personId);
		var personList = this.listarPersonas();
		personList = _.without(personList, personaBorrada);

		localStorage.setItem(this.keyPersonas, JSON.stringify(personList));
	}
};

var TablaPersonas = {
	
	selectorTBody: "#person-tbody",

	templateRow: "<tr data-person-id='<%=document%>'><td><%=document%></td><td><%=name%></td><td><%=surname%></td><td><%=inputEmail%></td></tr>",

	agregarPersona: function(persona) {

		var rowToAdd = _.template(this.templateRow, persona);
		$(this.selectorTBody).append($(rowToAdd));
	},

	eliminarPersona: function(personId) {
		$(this.selectorTBody + ' tr[data-person-id="' + personId + '"]').remove();
	}
};

var inicializarTabla = function() {

	var personList = StoragePersonas.listarPersonas();

	var markup = "<tr data-person-id='<%=document%>'><td><%=document%></td><td><%=name%></td><td><%=surname%></td><td><%=inputEmail%></td></tr>";

	$("#person-tbody").children().remove();

	for (var i = 0; i < personList.length; i++) {
		var personData = personList[i];
		TablaPersonas.agregarPersona(personData);
	}

	$('#person-tbody tr').click(function() {
		var personId = $(this).data('person-id');

		// Salvo el id de la persona seleccionada en el Session Storage para pasarlo a la otra vista.
		sessionStorage.setItem('personEdit', personId);
		$('a[href="#formulario"]').click();
	});
};

var inicializarFormulario = function() {

	var $tab = $('#formulario');

	var personId = sessionStorage.getItem('personEdit');

	if (personId) {
		var personData = StoragePersonas.recuperarPersona(personId);
		$('form input', $tab).each(function(){
			$(this).val(personData[$(this).attr('id')]);
		});
	}

	$('form', $tab).submit(function(){

		// Tomo la informacion del formulario y creo un JSON.
		var formData = {};
		$('form input', $tab).each(function(){
			formData[$(this).attr('id')] = $(this).val();
		});

		// Guardo la informacion en el Local Storage.
		StoragePersonas.guardarPersona(formData);

		// Limpio el formulario.
		$('form input', $tab).each(function(){
			$(this).val('');
		});

		sessionStorage.removeItem('personEdit');

		$('a[href="#lista"]').click();

		return false;
	});

	$('form button#cancel', $tab).click(function() {
		// Limpio el formulario.
		$('form input', $tab).each(function(){
			$(this).val('');
		});

		sessionStorage.removeItem('personEdit');

		$('a[href="#lista"]').click();

		return false;
	});
};

var inicializarConfiguracion = function() {
	var $tab = $('#configuracion');

	var configuracion = JSON.parse(localStorage.getItem('configuracion'));

	if (configuracion) {
		$('form input', $tab).each(function(){
			$(this).val(configuracion[$(this).attr('id')]);
		});		
	}

	$('form', $tab).submit(function() {

		// Tomo la informacion del formulario y creo un JSON.
		var formData = {};
		$('form input', $tab).each(function(){
			formData[$(this).attr('id')] = $(this).val();
		});

		localStorage.setItem('configuracion', JSON.stringify(formData));

	});
};