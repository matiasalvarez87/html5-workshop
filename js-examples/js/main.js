function showMain() {
	var tpl = _.template(app.templates.layout, {title: 'Ejemplo de Templates', section: 'Seccion'});
	$('body').html(tpl);
}

function showPersonList() {
	var persons = ['Matias', 'Julian', 'Pepe'];
	_.each(persons, function(p) {
		var tpl = _.template(app.templates.person.item, {name: p});
		$('#persons').append(tpl);
	});
}