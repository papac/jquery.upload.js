!(function($, window) {
	/**
     * Upload any file
     * @param  {object} option The option
     * @return {*}
     */
    window.uploader = function(option) {
        var form = new FormData();
		
		if (typeof option.fieldName == 'string') {
			form.append(option.fieldName, option.target);
		} else {
			form.append('file', option.target);
		}

        // is onprogress supported by browser?
        var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

        //If supported
        if (hasOnProgress) {
            // patch ajax settings to call a progress callback
            var oldXHR = $.ajaxSettings.xhr;
            $.ajaxSettings.xhr = function() {
                var xhr = oldXHR();
                if (xhr instanceof window.XMLHttpRequest) {
                    if (typeof option.progress === 'function') {
                        xhr.addEventListener('progress', option.progress, false);
                        if(xhr.upload) {
                            xhr.upload.addEventListener('progress', option.progress, false);
                        }
                    }
                }
                return xhr;
            };
        }
        
        // Set image to server
        return $.ajax({
            url: option.url,
            cache: false,
            processData: false,
            contentType: false,
            data: form,
            dataType: option.dataType || 'json',
            method: 'POST',
            headers: option.headers,
            beforeSend: option.before,
            success: function(data) {
                if (! option.dataUrl) {
                    return option.done(data);
                }
                var reader = new FileReader();
                reader.addEventListener('load', function() {
                    return option.done(data, reader.result);
                });
                return reader.readAsDataURL(option.target);
            }
        });
    };
})(jQuery, window);