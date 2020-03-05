$(document).ready(function () {

    // user profile page

    // left menu


    $('.left-menu-items').on('click', function () {
        $('.right-sub-panel-wrapper').css('display','none');
        if ($(this).text()== 'Profile'){
            $('#Profile').css('display','block')
        }else if($(this).text()== 'Orders'){
            $('#Orders').css('display','block')
        }else if($(this).text()== 'Journeys'){
            $('#Journeys').css('display','block')
        }else if($(this).text()== 'Notifications'){
            $('#Notifications').css('display','block')
        }else if($(this).text()== 'Account settings'){
            $('#Account-settings').css('display','block')
        }
    });

    // right-panel

    const nutrition_order_url = $('#current-completed-order-url').val();

    const nutrition_journey_url = $('#current-completed-journeys-url').val();
    const csrf_token = $('.csrf_token').val();
    // console.log('nutrition_order_url    '+nutrition_order_url);
    // console.log('nutrition_journey_url  '+nutrition_journey_url);


    // list all current and completed order

    $.ajax({
        url: nutrition_order_url,
        headers: { "X-CSRFToken": csrf_token },
        dataType:'json',
        method: 'GET',
        success: function (response) {
            $.map(response, function (val, key) {
                console.log( key , val);
                if(val.length){
                    let add_string='';
                    $.map(val, function (e) {
                        add_string+='<div class="each-instance-wrapper">\n' +
                        '<div id="each-order-init-details-wrapper">\n' +
                            '<div class="order-details">Date Created</div>\n' +
                            '<img class="order-details packageimage" src='+e.package_image+'/>\n' +
                            '<div class="order-details">Order description  -  '+e.package_description+'</div>\n' +
                            '<div class="order-details">Date Accepted</div>\n' +
                            '<div class="order-details">Price Offered</div>\n' +
                            '<div class="order-details">Order Status    -    '+e.order_status+'</div>\n' +
                            '<div class="order-details">Delivery Status</div>\n' +
                            '<div class="order-details">Weight</div>\n' +
                            '<div class="order-details">From</div>\n' +
                            '<div class="order-details">To</div>\n' +
                        '</div>\n' +
                        '<div id="each-order-response-details-wrapper">\n' +
                            '<div class="order-details" >' +
                            '<a href="http://127.0.0.1:8000/single-order/'+e.id+'">' +
                            'link</a>' +
                            '</div>\n' +
                            '<div class="order-details">Views</div>\n' +
                        '</div>\n' +
                        '</div>'
                    });
                    if(key == 'current_orders'){
                        $('#current-orders-container').append(add_string);
                    }else if(key == 'completed_orders'){
                        $('#completed-orders-container').append(add_string);
                    }
                }
            });
            $('.packageimage').css(
                'height', '30vh',
                'min-width', '26vw',
                'width', '26vw');

            // list all current and completed journey

            $.ajax({
                url: nutrition_journey_url,
                headers: { "X-CSRFToken": csrf_token },
                dataType:'json',
                method: 'GET',
                success: function (response) {
                    $.map(response, function (val, key) {
                        console.log(val);
                        if(val.length){
                            let add_string='';
                            $.map(val, function (e) {
                                add_string+='<div class="each-instance-wrapper">\n' +
                                '<div id="each-journey-init-details-wrapper">\n' +
                                    '<div class="journey-details">Date Created</div>\n' +
                                    '<div class="journey-details">Departure  -  '+e.depart_area_name+'</div>\n' +
                                    '<div class="journey-details">Destination  -  '+e.destination_area_name+'</div>\n' +
                                    '<div class="journey-details">Journey Status    -    '+e.journey_status+'</div>\n' +
                                '</div>\n' +
                                '<div id="each-journey-response-details-wrapper">\n' +
                                    '<div class="journey-details">Views</div>\n' +
                                '</div>\n' +
                                '</div>'
                            });
                            if(key == 'current_journey'){
                                $('#current-journey-container').append(add_string);
                            }else if(key == 'completed_journey'){
                                $('#completed-journey-container').append(add_string);
                            }
                        }
                    });
                }

            });

        }
    });
});