(function($){ 
	$.Placeholder = {
		settings : {
			color : "rgb(169,169,169)",
			dataName : "original-font-color"
		},
		
		init : function(settings){
			if(settings)
			{
				$.extend($.Placeholder.settings, settings);
			}
			
			var getContent = function(element){
				return $(element).val();		
			};
		
			var setContent = function(element, content){
				$(element).val(content);		
			};
			
			var getPlaceholder = function(element){
				return $(element).attr("placeholder");
			};
			
			var isContentEmpty = function(element){
				var content = getContent(element);
				return (content.length === 0) || content == getPlaceholder(element);
			};
				
			var setPlaceholderStyle = function(element){
				$(element).data($.Placeholder.settings.dataName, $(element).css("color"));
				$(element).css("color", $.Placeholder.settings.color);		
			};
			
			var clearPlaceholderStyle = function(element){
				$(element).css("color", $(element).data($.Placeholder.settings.dataName));		
				$(element).removeData($.Placeholder.settings.dataName);
			};
			
			var showPlaceholder = function(element){
				setContent(element, getPlaceholder(element));
				setPlaceholderStyle(element);	
			};
			
			var hidePlaceholder = function(element){
				if($(element).data($.Placeholder.settings.dataName)){
					setContent(element, "");
					clearPlaceholderStyle(element);
				}
			};
			
			var inputFocused = function(){
				if(isContentEmpty(this)){
					hidePlaceholder(this);		
				}
			};
			
			var inputBlurred = function(){
				if(isContentEmpty(this)){
					showPlaceholder(this);
				}
			};
			
			var parentFormSubmitted = function(){
				if(isContentEmpty(this)){
					hidePlaceholder(this);		
				}	
			};
                        
                        $('head').append('<style type="text/css" media="screen">[placeholder]:focus::-webkit-input-placeholder { color:transparent; }[placeholder]:focus:-moz-placeholder { color: transparent; }</style>');
			
                        var elementSupportsAttribute = function(element, attribute) {
                               var test = document.createElement(element);
                               return (attribute in test);
                        };
                        
                        if (!elementSupportsAttribute('textarea', 'placeholder')) {
                            $("textarea, input[type='text']").each(function(index, element){
                                    if($(element).attr("placeholder")){
                                            $(element).focus(inputFocused);
                                            $(element).blur(inputBlurred);
                                            $(element).bind("parentformsubmitted", parentFormSubmitted);

                                            // triggers show place holder on module init
                                            $(element).trigger("blur");
                                            // triggers form submitted event on parent form submit
                                            $(element).parents("form").submit(function(){
                                                    $(element).trigger("parentformsubmitted");
                                            });
                                    }


                            });
                        }
			
			return this;
		},
        
        cleanBeforeSubmit : function(theForm){
            if(!theForm){
                theForm = $("form");
            }
            
            $(theForm).find("textarea, input[type='text']").trigger("parentformsubmitted");
            
            return theForm;
        }
	}
})(jQuery);
