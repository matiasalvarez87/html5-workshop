/**
 * AjaxManager: Permite realizar peticiones AJAX almacenando los resultados en el LocalStorage. 
 * De esta manera se pueden solicitar recursos cuando el usuario pierde la conexion.
 **/
//(function() {

  "use strict";

  /**
   * Eventos: 
   *   - ('ajax:complete'): Cuando se completa (satisfactoria o erroneamente) una petición.
   *   - ('ajax:success', data): Resultado satisfactorio de la petición.
   *   - ('ajax:error', msg): Error de comunicación.
   *   - ('ajax:offline'): Alerta de cuando el usuario se encuentra offline.
   * */
  var AjaxManager = function(opts) {
    this.options = (opts || (opts = {}));
    this.options.storage = (opts.storage || (opts.storage = window.localStorage));
  };

  // Se extiende de Events para agregar dicha funcionalidad a la clase
  $.extend(AjaxManager.prototype, Events, {
 
    online: true, 

    /**
     * Petición GET. Parámetros: 
     * { url: 'URL_RECURSO', data: {param1: 'value1', param2: 'value2'}, cache: true }
     * */
    get: function(opts) {
      opts.method = 'get';
      this._ajax(opts);
    },

    /**
     * Petición POST. Parámetros: 
     * { url: 'URL_RECURSO', data: {param1: 'value1', param2: 'value2'}, cache: true }
     * */
    post: function(opts) {
      opts.method = 'post';
      this._ajax(opts);
    },

    /**
     * Se setean los handler de los eventos ajax y realiza la petición.
     * */
    _ajax: function(opts) {

      if (!opts.url) {
        throw new Error("Url must be specified!");
      }
      opts.data || (opts.data = {}); // Parameters
      opts.cache || (opts.cache = false); // Parameters
      opts.dataType = 'json'; // Only works with json format

      // Custom AjaxManager handlers
      opts.complete = $.proxy(this._onComplete, this);
      opts.error = $.proxy(function(xhr, ajaxOptions, thrownError) {
        this._onError(xhr, ajaxOptions, thrownError, {url: opts.url, params: opts.data});
      }, this);
      opts.success = $.proxy(function(data, textStatus, jqXHR) {
        this._onSuccess(data, textStatus, jqXHR, {url: opts.url, params: opts.data});
      }, this);

      var proxyCall = $.proxy(function() {
        $.ajax(opts);
      }, this);

      if (this.online) { // ONLINE Mode
        proxyCall();

      } else { // OFFLINE Mode
        this._getFromStorage(opts.url, opts.data);
        this.checkConnectionStatus(proxyCall);
      }
    },

    /**
     * Verifica el estado de la conexión. En caso de recuperarse la conexión
     * se invoca el callback (petición original la cual no se ejecuto porque
     * la conexión estaba como offline).
     * */
    checkConnectionStatus: function(callback) {
      var that = this;

      $.ajax({
        url: 'favicon.ico',
        cache: false,
        success: function() {
          that.online = true;
          callback();
        }
      });
    },

    /**
     * Ajax onSuccess handler. Guarda el resultado en el storage y invoca al método para 
     * devolver la respuesta.
     * */
    _onSuccess: function(data, textStatus, jqXHR, info) {
      this._saveResponseHandler(info.url, info.params, data);
      this._returnResponse(data);
    },

    /**
     * Ajax onError handler. Verifica el tipo de error, si el usuario ha perdido la conexión, 
     * se lanza el evento ajax:offline para informar dicha situación. En caso de que se haya 
     * producido otro tipo de error, se lanza el evento ajax:error con la info.
     * */
    _onError: function(xhr, ajaxOptions, thrownError, info) {
      // 0: request not initialized 
      // 1: server connection established
      // 2: request received 
      // 3: processing request 
      // 4: request finished and response is ready
      if ( xhr.readyState !== 4 && xhr.isRejected() ) { // Error conecction (offline mode)
        this.online = false;
        this.trigger('ajax:offline');
        this._getFromStorage(info.url, info.params);
      } else {
        this.trigger('ajax:error', {xhr: xhr, error: thrownError, msg: 'Communication error: ' + thrownError} );
      }
    },

    /**
     * Ajax onComplete handler. Lanza el evento ajax:complete con los datos.
     * */
    _onComplete: function(xhr, status) {
      this.trigger('ajax:complete', {xhr: xhr, status: status});
    },

    /**
     * Lanza el enveto ajax:success agregando el resultado de la petición.
     * */
    _returnResponse: function(data) {
      this.trigger('ajax:success', data);
    },

    /**
     * Guarda la respuesta del server en el storage asignado al AjaxManager.
     * */
    _saveResponseHandler: function(url, params, data) {
      this.options.storage.setItem(this._normalizeUrl(url, params), JSON.stringify(data));
    },

    /**
     * Obtiene del storage (si existe) la petición
     * */
    _getFromStorage: function(url, params) {
      var rsp = this.options.storage.getItem(this._normalizeUrl(url, params));
      if (rsp && rsp !== '') {
        rsp = JSON.parse(rsp);
        this._returnResponse(rsp);
      } else {
        this.trigger('ajax:error', {msg: 'There is no data saved on local storage.'} );
      }
    },

    /**
     * Formatea la url y los parametros, para ser usado como clave en el storage.
     * TODO: Crear url canónica (parámetros ordenados alfabeticamente para evitar repetir entradas).
     * */
    _normalizeUrl: function (url, params) {
      var qryStr = $.param(params, $.ajaxSettings.traditional);
      qryStr === '' || (qryStr = '?' + qryStr);
      return url + qryStr;
    }
  });

//}).call(this);