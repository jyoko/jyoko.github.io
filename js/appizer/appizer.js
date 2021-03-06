// appIzer
// version: DEMO -- FOR_DISPLAY_ONLY!
// pushing demo-specific data in for pure client example,
//  this should be obviously useless unless you're doing the same thing.
//  basically the same with appIzer.update() redone

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
console.log(input);
        // Push example values in as fields change
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
            $('#truck').html('<option value="1">518</option><option value="3">610</option>');
        }
        if (input == '3') {
            $('#techs').html('<option value="Driver" selected>Driver</option><option value="Passenger">Passenger</option>');
            $.fn.appIzer.makePretty('techs');
        }
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

    // For dummy searches
    var locationSearch = [  'Canterbury',
                            '123 Fake St',
                            'Bentley',
                            '3472 W Penn Ave'
                         ];
    var unitSearch     = [  '1','2','3','4','5','6','7','8','9','10',
                            '2a','2b','2c','2b','2d','2e','2f'
                         ];
    var clientSearch   = [  'John Smith',
                            'Mozart',
                            'Generic Management',
                            'Bill Olid',
                            'Crazy Eddie',
                            'CheapAss'
                         ];

    // appIze header
    $('#header').appIzer();
    // TODO: Add this headerbar functionality
    $('.toggleHeader').on('click.appizer',function(){
        $('#header').toggle('blind');
        $('#header-status').addClass('activeSheet').html($('#date').val());
    });

    // appIzer hacks added here
    var i=1;
    $('label').each(function() {
        if(i%2==0) {
            $(this).addClass('altLabel');
        }
        i++;
    });
    $('label').after('<div class="divLine"></div>');

    // autocomplete sheet
    $('#location').autocomplete({
        source: locationSearch
    });
    $('#unit').autocomplete({
        source: unitSearch
    });
    $('#client').autocomplete({
        source: clientSearch
    });

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

