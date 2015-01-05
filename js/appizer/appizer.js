// appIzer
// version: pre-alpha
//  used for easily making FORMs as a web-app
//  jQuery(UI) Plugin-ish now
//  Looking at React...

;(function( $,window,document,undefined ) {

    // define appIzer
    $.fn.appIzer = function(options) {
        // Extend defaults
        var settings = $.extend({}, $.fn.appIzer.defaults, options);

        // Loop over everything to support multiple forms at once
        this.each(function() {
            // TODO: I bet multiple forms reqires logic here
            
            // Take over & prettify elements in the form
            $(':input',this).each(function() {
            
                // Apply on 'change' listener to all elements
                $(this).on('change.appizer', function() {
                    $(this).appIzer.update(this.value);
                });
                
                // Apply effects to element
                $.fn.appIzer.makePretty(this);
            });
        });
    };

    // define defaults
    $.fn.appIzer.defaults = {
        addOptionText : 'Add new technician'
    };

    // update display forms - probably better as refresh()?
    $.fn.appIzer.update = function(input) {

        // Get JSON response as {nextID:'id',toFill:htmlReplace}
        $.getJSON('./backend/header.php?d='+input).done(function(data) {
            if (data.toFill) {
                // Check type of fill field
                if ($('#'+data.nextID).attr('multiple')=='multiple') {
                    $('#div'+data.nextID).remove();
                    $('#'+data.nextID).html(data.toFill);
                    $('#'+data.nextID).appIzer.makePretty(data.nextID);
                } else {
                    $('#'+data.nextID).html(data.toFill);
                }
                $.fn.appIzer.update($('#'+data.nextID).val());
            }
        })
    .fail(function(jqxHr,settings,exception){console.log(exception);});
    };
    
    // applies effects to given element
    // TODO: remove inline HTML
    $.fn.appIzer.makePretty = function(element) {
    
        // If element is a string assume it's the element ID
        if ( typeof element === 'string' ) {
            element = $('#'+element);
        }
        var elementID = $(element).attr('id');

        // Add datepicker
        if ( $(element).hasClass('appizerDate') ) {
            $(element).datepicker();
        }
        
        // prettify multiple-select
        // TODO: make all fields clickable, add delete
        if ( $(element).attr('multiple')=='multiple' ) {
            var counter = 0;
            var divID = 'div'+elementID;
            var spanID = 'span'+elementID;
            var msg = $.fn.appIzer.defaults.addOptionText;
            
            if ($('#'+divID).length) {
                $('#'+divID).remove();
            }
            // Prepend with newDIV
            $('#'+elementID).before('<div class="multiSelect" id="'+divID+'"></div>');
            // Loop OPTIONs, load into newDIV->SPANs
            $('#'+elementID+'  option').each(function() {
                var uspanID = spanID+counter;
                var spanClass = (this.selected)?'multiSval':'multiVal';
                $('#'+divID).append('<span class="'+spanClass+'" id="'+uspanID+'">'+$(this).val()+'</span>');
                // TODO: this feels inefficient as hell
                $('#'+uspanID).on('click.appizer.'+uspanID, function() {
                    $('#'+elementID+' option').each(function() {
                        if(this.innerHTML == $('#'+uspanID).html()) {
                            this.selected = (this.selected)?false:true;
                            $.fn.appIzer.makePretty(elementID);
                        }
                    });
                });
                counter++;
            });
            $('#'+elementID).hide();

            //TODO: add this during next plugin restruct
            addNewOption(divID,elementID,msg,counter);
        }
        
        // makePrettySelect pulling out
        $.fn.appIzer.makePrettySelect = function(elementID) {}
            
    };
    
}(jQuery,window,document));

// on DOMready, initialize everything
$(function() {

    // Turn on appIzer, this is going to get pulled out soon
    $('#header').appIzer();

});

// Creates a clickable 'Add New' option to multiselect DIV
// subroutine of makePrettySelect, don't use directly
// Needs DIV and SELECT ids, msg to show for add text, counter for recursive use
function addNewOption(divID,selectID,msg,counter) {

    counter = counter || 0;
    var newSpan = 'span'+divID+counter;
    var newText = 'text'+selectID+counter;

    // Add new option to DIV with handlers
    $('#'+divID).append('<span class="multiAdd" id="'+newSpan+'">'+msg+'</span>');
    $('#'+divID).append('<input type="text" class="magicBox" name="'+newText+'" id="'+newText+'">');
    $('#'+newText).hide();
    $('#'+newSpan).click(function() {
        $(this).off('click');
        $(this).hide();
        $('#'+newText).show().focus();
    });
    $('#'+newText).blur(function() {
        var newValue = $('#'+newText).val();
        $('#'+newSpan).html(newValue);
        $('#'+selectID).append('<option selected value="'+newValue+'">'+newValue+'</option>');
        $('#'+newText).remove();
        $('#'+newSpan).show();
        $.fn.appIzer.makePretty(selectID);

        // TODO: $.fn.appIzer.update();
    });

}

