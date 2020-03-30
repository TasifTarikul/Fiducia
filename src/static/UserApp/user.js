$(document).ready(function () {

    // user profile page

    // left menu

    // function to get all negotitators for orders
    function get_total_negotiator(negotiates_array, order_status){
        let total_negotiator = 0;
        if(order_status == 'awaiting'){
            for (var n in negotiates_array){
                if(negotiates_array[n].negotiation_status== 'active'){
                    total_negotiator++;
                }
            }
            console.log(total_negotiator);
            if(total_negotiator == 1) {
                return '<div class="order-details">You have '+total_negotiator+' negotiator</div>';
            }else if(total_negotiator > 1){
                return '<div class="order-details">You have '+total_negotiator+' negotiators</div>';
            }
        }else{
            return '';
        }
    }

    function get_total_negotiates(negotiates_array, journey_status){
        let total_negotiates = 0;
        if(journey_status == 'active'){
            for (var n in negotiates_array){
                if(negotiates_array[n].negotiation_status== 'active'){
                    total_negotiates++;
                }
            }

            if (total_negotiates == 1){
                return'<div class="journey-details badge badge-info mr-1">' +
                    'You have 1 negotiatiaton</div>'
            }else if(total_negotiates>1){
                return'<div class="journey-details badge badge-info mr-1">' +
                    'You have '+total_negotiates+' negotiations</div>'
            }else{
                return'<div class="journey-details badge badge-info mr-1">You have no negotiates for this journey</div>'
            }
        }else{
            return '';
        }
    }

    function get_orders_carrying(journey_order_array, journey_status){
        let total_orders = 0;
        if(journey_status == 'active'){
            for (var e in journey_order_array){
                if(journey_order_array[e].accepted_order_status == 'active'){
                    total_orders++;
                }
            }
        }
        if(total_orders == 1){
            return  '<h5 class="journey-details badge bg-info"><span></span>Carrying 1 package</h5>\n'
        }else if(total_orders > 1){
            return  '<h5 class="journey-details badge bg-info"><span>Carrying '+total_orders+' packages</span></h5>\n'
        }else if(total_orders == 0){
            return  '<h5 class="journey-details badge bg-info"><span>Carrying no package</span></h5>\n'
        }

    }

    function get_orders_carried(journey_order_array, journey_status){
        let total_orders = 0;

        if(journey_status == 'completed'){
            if(journey_order_array.some( e => e.accepted_order_status == 'completed')){
                total_orders++;
            }
        }

        if(total_orders == 1){
                return  '<div class="journey-details">Carried 1 package </div>\n'
            }else if(total_orders > 1){
                return  '<div class="journey-details">Carried '+total_orders+' packages </div>\n'
            }else if(total_orders==0){
                return  '<div class="journey-details">Carried no package </div>\n'
            }
    }

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
                            '<div class="order-details">Price Offered</div>\n';
                        if(e.order_status == 'accepted'){
                            add_string+='<h5 class=""><span class="badge badge-success">'+e.order_status+'</span></h5>'
                        }
                            add_string+='<div class="order-details">Delivery Status</div>\n' +
                            '<div class="order-details">Weight</div>\n' +
                            '<div class="order-details">From</div>\n' +
                            '<div class="order-details">To</div>\n' +
                        '</div>\n' +
                        '<div id="each-order-response-details-wrapper">\n' +
                            '<div class="order-details" >';
                        add_string+= get_total_negotiator(e.negotiates, e.order_status);
                        add_string+='<div class="order-details">Views</div>\n' +
                            '<a href="http://127.0.0.1:8000/single-order/'+e.id+'">' +
                            'Details</a>' +
                            '</div>\n' +
                        '</div>\n' +
                        '</div>'
                    });
                    if(key == 'current_orders'){
                        $('#current-orders-container').append(add_string);
                    }else if(key == 'completed_orders'){
                        $('#completed-orders-container').append(add_string);
                    }
                }else{
                    if (key=='current_orders'){
                        $('#current-orders-container').append(
                            '<h3 class=""><span class="badge badge-pill">No current Orders</span></h3>'
                        );
                    }else if(key=='completed_orders'){
                        $('#completed-orders-container').append(
                            '<h3 class=""><span class="badge badge-pill">No Orders recieved</span></h3>'
                        );
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
                        console.log(key,val);
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
                                '<div id="each-journey-response-details-wrapper">\n';
                                add_string += get_total_negotiates(e.negotiates, e.journey_status);

                                if(key == 'current_journey'){

                                    add_string+= get_orders_carrying(e.journey_order, e.journey_status);

                                }else if(key == 'completed_journey'){

                                    add_string+= get_orders_carried(e.journey_order, e.journey_status);
                                }
                                add_string+='<div class="journey-details">Views</div>\n' +
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