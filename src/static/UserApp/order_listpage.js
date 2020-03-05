$(document).ready(function () {

    const nutrition_journey_url = $('#current-completed-journeys-url').val();
    const api_url = $('#order-list-url').val();
    const journey_order_url = $('#journey-order-url').val();
    const csrf_token_order_list = $('#order-list-csrf-token').val();
    const current_user = $('#current_user').val();
    console.log(current_user);
    // Order list page

    $('.order-type-top-nav-items').on('click', function () {
        console.log($(this).text());
        $('.order-list-container').css('display', 'none');
        if ($(this).text() == 'Selfpacked'){
            $('#selfpacked-order-list-container').css('display','block')
        }else if($(this).text() == 'Cybershop orders'){
            $('#cybershop-order-list-container').css('display','block')
        }
    });
        // get all current orders


    $.ajax({
        url: api_url,
        headers: {'X-CSRFToken': csrf_token_order_list},
        dataType: 'json',
        method: 'GET',
        success: function (response) {
            $.map(response, function (val, key) {
                console.log(key);
                var htmlstring='';
                $.map(val, function (order) {
                    htmlstring+=
                        '<div id="'+order.id+'" class="order-wrapper">\n' +
                        '<img class="order-image" src='+order.package_image+'/>\n' +
                        '<div class="order-list-order-details">\n' +
                        '<div>'+order.package_description+'</div>\n' +
                        '<div>'+order.delivery_date+'</div>\n';
                        if (order.departure !=null){
                            htmlstring+='<div> depar'+order.package_from+'</div>'
                        }
                    htmlstring+=
                        '<div>'+order.package_to+'</div>\n' +
                        '<div>'+order.package_weight+'</div>\n' +
                        '<div>'+order.delivery_price+'</div>\n' +
                        '</div>\n' +
                        '<div class="order-button-wrapper">\n' +
                        '<div id="" class="order-button accept-button">Accept</div>\n' +
                        '<div class="order-button negotiate-button">Negotiate</div>\n' +
                        '</div>\n' +
                        '</div>'
                });
                if (key == 'selfpacked'){
                    $('#selfpacked-order-list-container').append(htmlstring)
                }else if(key == 'cybershop'){
                    $('#cybershop-order-list-container').append(htmlstring)
                }
            });
        }
    });

    // get current journey of user

    console.log('accept');
    console.log(nutrition_journey_url);
    $.ajax({
            url: nutrition_journey_url,
            headers: { "X-CSRFToken": csrf_token_order_list },
            dataType:'json',
            method: 'GET',
            success: function (response) {
                $.map(response, function (val, key) {
                    console.log( key , val);
                    if (key == 'current_journey'){
                        let add_string='';
                        if(val.length){
                            $.map(val, function (journey) {
                                add_string+=
                                    '<div class="each-current-journey-wrapper">\n' +
                                    '<div class="current-order-checkbox-wrapper">\n' +
                                    '<input type="radio" class="current-order-checkbox" name="journey" value='+journey.id+'>\n' +
                                    '</div>\n' +
                                    '<div class="each-current-journey">\n' +
                                    '\n' +
                                    '<div>\n' +
                                    'Departure  -  '+journey.depart_area_name+'-  <span>  deaprture date</span>\n' +
                                    '</div>\n' +
                                    '<div>\n' +
                                    'Destination  -  '+journey.destination_area_name+'  <span>destination date</span>\n' +
                                    '</div>\n' +
                                    '</div>\n' +
                                    '</div>'
                            });

                            add_string+=
                            '<div class="modal-submit-button-wrapper">' +
                                '<div id="" class="modal-submit-button"><input type="submit" name="Accept" value="Accept"></div>' +
                            '</div>'

                        }else{
                            var create_journey_url = $('#be-a-traveller-url').val();
                            add_string+=
                                '<h1>No Current Journeys</h1>'+
                                '<div>' +
                                '<a href="'+create_journey_url+'">Create A New Journey</a>' +
                                '</div>'
                        }
                        $('#modal-current-journey').append(add_string)
                    }
                });
            }
        });

    // Accept button pressed

    $('.order-list-container').on('click','.accept-button', function () {
        let _order_id = $(this).closest('.order-wrapper').attr('id');
        // $('#modal-current-journey .modal-submit-button').attr('id', _order_id);
        $("#modal-current-journey [name='order']").remove(); // remove any previous order id appended
        $('<input type="hidden" value="'+_order_id+'" name="order">').insertBefore('.modal-submit-button-wrapper');
        $('.main-modal').css('display', 'block')
    });

    // click on Submit modal

    // $('.modal-content-container').on('click', '.modal-submit-button', function () {
    //     const journey_id = $('#modal-current-journey input:radio:checked').attr('value');
    //     const order_id = $(this).attr('id');
    //     console.log(
    //         'journey_id '+journey_id+
    //         ' order_id '+order_id+
    //         ' url '+journey_order_url
    //     );
        // $.ajax({
        //     url: journey_order_url,
        //     headers:{'X-CSRFToken': csrf_token_order_list},
        //     method: 'POST',
        //     dataType: 'json',
        //     data:{
        //         'journey':journey_id,
        //         'order': order_id,
        //         'accepted_order_status': 'active',
        //     }
        // });
        //
        // $('.main-modal').css('display', 'none')
    // });

    // Negotiate button pressed

    $('.order-list-container').on('click','.negotiate-button', function () {
        console.log('negotiate');
    });

    // close modal view

    $('.close-main-modal-button').on('click', function () {
        $('.main-modal').css('display', 'none');
    });
});