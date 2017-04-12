(function(){
  jQuery( document ).ready(function( $ ) {
    var sortt = $('.chosen-choices').sortable({
      cancel: 'a',
      handle: 'span',
      delay: 100,
      items: '> li.search-choice'
    }),
    getIds = function (div) {
      var chosenid = $(div).attr('id'),
      re = new RegExp('_', 'g'),
      selectid = chosenid.replace(re,'-').replace('-chosen','');
      return {cid: chosenid, sid: selectid};
    },
    //|  On update store order of all chosen widgets in hidden fields
    updateFieldOrder = function (event, ui) {
      var order = sortt.toArray();  //  all chosen select choices, one array item per chosen select field

      $.each(order,function(i,o){
        var ids = getIds($(o).parent()),
        cid = ids.cid,       //| - chosen selector
        sid = ids.sid,       //| - original field selector
        tids = [],
        alltids = $(o).parent().prev('.chosen-enable').find('option');

        //|  Get selected choices
        $('#'+cid+' .chosen-choices li a').each(function(i,choice){
          tids.push($(choice).attr('data-option-array-index'));
        });

        //|  Map to term IDs
        tidsOrder = $.map(tids, function(choice, i){
          return $(alltids[choice]).attr('value');
        });

        //|  Store in field
        $('#'+cid+'_order').val(tidsOrder);
      });
    },
    reorderChosenChoices = function(rendered,saved,elements) {
      var done = $(saved).each(function(i){
        var renderedIndex = rendered.indexOf(saved[i]),
        direction = renderedIndex - i;

        if (renderedIndex !== -1 && i !== renderedIndex) {
          if (direction > 0) {
            $(elements[renderedIndex]).insertBefore(elements[i]);
            return false;
          } else if (direction < 0) {
            $(elements[i]).insertBefore(elements[renderedIndex]);
            return false;
          }
        }
        return true;
      });

      if (!done) {
        reorderChosenChoices(rendered,saved,elements);
      }
    };


    //|  FIRST - Update chosen order to saved order on page load
    $('.field-type-chosen-order').each( function(i) {
      var savedOrder = $(this).val().split(','),                           //|  array of tids as saved in db
      chosenid = $(this).attr('id').split('_order')[0],                    //|  html id of chosen container element
      chosenChoices = $('#'+chosenid+' .chosen-choices li.search-choice'), //|  array of choices as select option indexes
      selectid = chosenid.split('_chosen')[0].replace(/_/g, '-'),          //|  html id of select options
      selectOptions = $('#'+selectid+' option')                            //|  array of all tids ordered mirroring select options
      .map(function(i, el){
        return $(el).val();
      }).toArray(),
      renderedOrder = $(chosenChoices)                                     //|  array of tids ordered as first rendered
      .map(function(i, el){
        var i = $(el).find('a.search-choice-close').attr('data-option-array-index');
        return selectOptions[i];
      }).toArray();

      reorderChosenChoices(renderedOrder,savedOrder,chosenChoices);
    });


    //|  SECOND - Bind save order to update
    $('ul.chosen-choices').bind('sortupdate', updateFieldOrder);

    //|  THIRD - Bind save order to update
    $('select.chosen-enable').bind('change', updateFieldOrder);

    //|  FOURTH - on remove choice save order
    $('a.search-choice-close').click( function(event) {
      sortt.trigger('sortupdate');
    });

  });
})();