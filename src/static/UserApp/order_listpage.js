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
                console.log(key, val);
                var htmlstring='';
                $.map(val, function (order) {
                    let current_user_is_negotiator = false;
                    let orderer = order.orderer.toString();
                    htmlstring+=
                        '<div id="'+order.id+'" class="order-wrapper mt-3">\n' +
                        '<img class="order-image" src='+order.package_image+'/>\n' +
                        '<div class="order-list-order-details">\n' +
                        '<div>Package description '+order.package_description+'</div>\n' +
                        '<div>Delivery date '+order.delivery_date+'</div>\n';
                        if (order.departure !=null){
                            // some orders  may not have
                            htmlstring+='<div> departure '+order.package_from+'</div>'
                        }
                    htmlstring+=
                        '<div>To '+order.package_to+'</div>\n' +
                        '<div>Weight '+order.package_weight+'</div>\n' +
                        '<div>Delivery price '+order.delivery_price+'</div>\n';

                        // check if the current user is negotiator of this order

                        if (order.negotiates.some(n => n.negotiator == parseInt(current_user) &&
                                    (n.negotiation_status == 'accepted' || n.negotiation_status == 'active'))){
                            current_user_is_negotiator = true;
                            htmlstring+='<div id="" class="badge badge-info">Negotiation in process</div>\n'
                        }

                        htmlstring+='</div>\n';
                        console.log(current_user_is_negotiator);
                        // if current user is in negotitation or is a orderer
                        // disable accept and negotitation button by not adding
                        //  the classes .accept-button and .negotiate-button
                        if(orderer === current_user || current_user_is_negotiator){
                            htmlstring+='<div class="order-button-wrapper">\n' +
                                '<div id="" class="order-button btn-primary" style="margin-right: 30px">Accept</div>\n' +
                                '<div class="order-button btn-secondary"' + '>Negotiate</div>\n' +
                                '</div>\n' +
                                '</div>'
                        }else if (order.orderer !== current_user){
                            htmlstring+='<div class="order-button-wrapper">\n' +
                                '<div id="" class="order-button accept-button btn-primary">Accept</div>\n' +
                                '<div class="order-button negotiate-button btn-secondary"' +
                                'data-toggle="modal" data-target="#exampleModalCenter">Negotiate</div>\n' +
                                '</div>\n' +
                                '</div>'
                            }

                });
                if (key == 'selfpacked'){
                    $('#selfpacked-order-list-container').append(htmlstring)
                }else if(key == 'cybershop'){
                    $('#cybershop-order-list-container').append(htmlstring)
                }
            });
        }
    });$('.order-list-container').on('click','.accept-button', function () {
        let _order_id = $(this).closest('.order-wrapper').attr('id');
        // $('#modal-current-journey .modal-submit-button').attr('id', _order_id);
        $("#modal-current-journey [name='order']").remove(); // remove any previous order id appended
        $('<input type="hidden" value="'+_order_id+'" name="order">').insertBefore('.modal-submit-button-wrapper');
        $('.main-modal').css('display', 'block')
    })

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
                                    '<div class="form-check each-current-journey-wrapper">\n' +
                                    '<input type="radio" class="form-check-input current-journey-checkbox" name="journey" value='+journey.id+'>\n' +
                                    '<label class="form-check-label" for="gridRadios1">' +
                                    'From <strong>'+journey.depart_area_name+'</strong> date   '+
                                    'To <strong>'+journey.destination_area_name+'</strong> date</label>'+
                                    '</div>'
                            });

                            $(add_string).insertBefore('.nego-price-wrapper');// add to negotiation modal

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
                                '</div>';
                            $('.negotiation-modal-body').html(add_string)
                        }
                        $('#modal-current-journey').append(add_string);
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

    // Negotiate button pressed

    $('.order-list-container').on('click','.negotiate-button', function () {
        let _order_id = $(this).closest('.order-wrapper').attr('id');
        $(".negotiate-field-wrapper [name='order']").remove(); // remove any previous order id appended
        $('<input class="nego-order" type="hidden" value="'+_order_id+'" name="order">' +
            '<input class="negotaition_status" type="hidden" value="active" name="negotiation_status">' +
            '<input class="negotitator" type="hidden" value="'+current_user+'" name="negotiator" >').insertBefore('.submit-nego-price-button');
    });

    // close modal view

    // Submit negotiate price


    $('.close-main-modal-button').on('click', function () {
        $('.main-modal').css('display', 'none');
    });
});