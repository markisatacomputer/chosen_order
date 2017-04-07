(function(){
  jQuery( document ).ready(function( $ ) {

    var sortt = $(".chosen-choices").sortable({
      //|  On update store order of all chosen widgets in hidden fields
      update: function (event, ui) {
        var order = sortt.toArray();  //  all chosen select choices, one array item per chosen select field

        $.each(order,function(i,o){
          var pid = $(o).parent().attr('id'),                                          //| - chosen selector
          re = new RegExp('_', 'g'), sid = pid.replace(re,'-').replace('-chosen',''),  //| - original field selector
          tids = [],
          alltids = $(o).parent().prev('.chosen-enable').find('option');

          //|  Get selected choices
          $('#'+pid+' .chosen-choices li a').each(function(i,choice){
            tids.push($(choice).attr('data-option-array-index'));
          });

          //|  Map to term IDs
          tidsOrder = jQuery.map(tids, function(choice, i){
            return $(alltids[choice]).attr('value');
          });

          //|  Store in field
          $('#'+pid+'_order').val(tidsOrder);
        });
      }
    });



    //|  Update chosen order to saved order on page load
    $(".field-type-chosen-order").each( function(i) {
      var savedOrder = $(this).val().split(','),                     //|  array of tids as saved in db
      chosenid = $(this).attr('id').split('_order')[0],              //|  html id of chosen container element
      selectid = chosenid.split('_chosen')[0].replace(/_/g, '-'),    //|  html id of select options
      options = $('#'+selectid+' option')                            //|  array of all tids ordered mirroring select options
      .map(function(i, el){
        return $(el).val();
      }),
      choices = $('#'+chosenid+' .chosen-choices li.search-choice'), //|  array of choices as select option indexes
      orderedChoices = [];

      //|  take the chosend selected li elements and put them in the right order
      $(choices).each(function(i){
        var index = $(this).find('a').attr('data-option-array-index'),
        tid = options[index],
        correctIndex = savedOrder.indexOf(tid);
        if (correctIndex >= 0) {
          orderedChoices[correctIndex] = this;
        }
      });

      //|  replace chosen-choices li with correctly ordered li
      $('#'+chosenid+' .chosen-choices li').replaceWith(orderedChoices);
    });

  });
})();