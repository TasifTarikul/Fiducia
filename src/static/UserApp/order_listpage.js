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

        $('.order-type-top-nav-items').removeClass('hover-effect-selected');
        $('.order-type-top-nav-items').addClass('hover-effect');
        $(this).removeClass('hover-effect');
        $(this).addClass('hover-effect-selected')
    });

    // add_orderer daetail to modal

    function add_orderer_detail_to_modal(orderer_id, image_url, first_name, last_name, nationality, short_bio){
        $('#order-list-page-orderer-detail-container').append(
            '<div id="order-list-page-orderer-'+ orderer_id +'" class="row order-list-page-each-orderer-detail-modal">\n' +
            '<div class="col-sm-6">Profile pic \n' +
            '<img id="single-journeypage-order-image" class=" img-fluid" src="'+image_url+'">\n' +
            '</div>\n' +
            '<div class="col-sm-6">\n' +
            '<div id="negotiation-modal-orderer-name" class="form-group">'+first_name+''+last_name+ '</div>\n' +
            '<div id="negotiation-modal-order-nationality" class="form-group">'+nationality+'</div>\n' +
            '<div id="negotiation-modal-order-short-bio" class="form-group">'+short_bio+'</div>\n' +
            '</div>\n' +
            '</div>'
        )
    }
        // get all current orders

    $.ajax({
        url: api_url,
        headers: {'X-CSRFToken': csrf_token_order_list},
        dataType: 'json',
        method: 'GET',
        success: function (response) {
            $.map(response, function (val, key) {
                console.log(key, val);
                if (key == 'selfpacked'){
                    let htmlstring='';
                    let orderer_detail_modal_string='';
                    $.map(val, function (order) {
                        let current_user_is_negotiator = false;
                        let orderer = order.orderer.id.toString();
                        console.log(orderer);
                        console.log(current_user);

                        htmlstring+=
                            '<div id="'+order.id+'" class="order-wrapper bg-light">\n' +
                            '<img class="order-image" src='+order.package_image+'/>\n' +
                            '<div class="order-list-order-details">\n' +
                            '<div id="" class="" data-orderer-id="'+order.orderer.id+'" data-target="#order-list-page-orderer-detail-modal" data-toggle="modal" >Orderer '+order.orderer.first_name+'</div>\n' +
                            '<div>Package description '+order.package_description+'</div>\n' +
                            '<div>Deliver by <span class="font-weight-bold">'+order.delivery_date+'</span></div>\n';
                            if (order.departure !=null){
                                // some orders  may not have
                                htmlstring+='<div> departure '+order.package_from+'</div>'
                            }
                        htmlstring+=
                            '<div>To '+order.package_to+'</div>\n' +
                            '<div>Weight '+order.package_weight+'</div>\n' +
                            '<div>Delivery price<i class="delivery-price">'+order.delivery_price+'</i></div>\n';

                            // check if the current user is INVOLVED IN NEGOTIATION for this order

                            if (order.negotiates.some(n => n.traveller == parseInt(current_user) && n.negotiation_status == 'active')){

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
                                    '<div id="" class="order-button alert-primary" style="margin-right: 30px" >Accept</div>\n' +
                                    '<div class="order-button alert-dark"' + ' disabled>Negotiate</div>\n' +
                                    '</div>\n' +
                                    '</div>'
                            }else if (order.orderer !== current_user){
                                htmlstring+='<div class="order-button-wrapper">\n' +
                                    '<div id="" class="order-button accept-button btn-primary">Accept</div>\n' +
                                    '<div class="order-button negotiate-button btn-secondary"' +
                                    ' data-toggle="modal" data-target="#exampleModalCenter">Negotiate</div>\n' +
                                    '</div>\n' +
                                    '</div>'
                                }
                                // add orderer detaile to orderer modal
                                add_orderer_detail_to_modal(order.orderer.id,order.orderer.profile_pic,
                                    order.orderer.first_name, order.orderer.last_name, order.orderer.nationality,
                                    order.orderer.short_bio);
                    });

                    $('#selfpacked-order-list-container').append(htmlstring);
                    $('#order-list-page-orderer-detail-container').append(orderer_detail_modal_string)

                }else if(key == 'cybershop'){
                    var htmlstring='';
                    $.map(val, function (order) {
                        let current_user_is_negotiator = false;
                        let orderer = order.orderer.id.toString();
                        htmlstring+=
                            '<div id="'+order.id+'" class="order-wrapper bg-light">\n' +
                            '<img class="order-image" src='+order.package_image+'/>\n' +
                            '<div class="order-list-order-details">\n' +
                            '<div  data-orderer-id="'+order.orderer.id+'" data-target="#order-list-page-orderer-detail-modal" data-toggle="modal" >Orderer ' + order.orderer.first_name+'</div>\n' +
                            '<div>Package description '+order.package_description+'</div>\n' +
                            '<div>Delivery by <span class="font-weight-bold">'+order.delivery_date+'</span></div>\n';
                            if (order.departure !=null){
                                // some orders  may not have
                                htmlstring+='<div> departure '+order.package_from+'</div>'
                            }
                        htmlstring+=
                            '<div>To ' + order.package_to+'</div>\n' +
                            '<div>URL- ' + order.url+'</div>\n' +
                            '<div>Item Price ' + order.cyber_product_price+'</div>\n' +
                            '<div>Delivery price<i class="delivery-price">'+order.delivery_price+'</i></div>\n';

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
                        add_orderer_detail_to_modal(order.orderer.id,order.orderer.profile_pic,
                            order.orderer.first_name, order.orderer.last_name, order.orderer.nationality,
                            order.orderer.short_bio);

                    });

                    $('#cybershop-order-list-container').append(htmlstring)
                }
            });
        }
    });


    $('.order-list-page-each-orderer-detail-modal').hide();

    $('#order-list-page-orderer-detail-modal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget); // Button that triggered the modal
      var orderer = button.data('orderer-id');// Extract class name that will be shown in the modal, from data-* attributes
      console.log(orderer);
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      $('.order-list-page-each-orderer-detail-modal').hide();
      $('#order-list-page-orderer-'+orderer).show();
      // modal.find('.modal-title').text('New message to ' + recipient)
      // modal.find('.modal-body input').val(recipient)
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
        let delivery_price = $(this).closest('.order-wrapper').find('.delivery-price').text();
        console.log(delivery_price);
        // $('#modal-current-journey .modal-submit-button').attr('id', _order_id);
        $("#modal-current-journey [name='order']").remove(); // remove any previous order id appended
        $("#modal-current-journey [name='delivery_price']").remove();
        $('<input type="hidden" value="'+_order_id+'" name="order">').insertBefore('.modal-submit-button-wrapper');
        $('<input type="hidden" value="'+delivery_price+'" name="delivery_price">').insertBefore('.modal-submit-button-wrapper');
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