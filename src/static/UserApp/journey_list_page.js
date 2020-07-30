$(document).ready(function () {

    const current_user_id = $('#journey-list-current-user-id').val();
    const all_journey_url = $('#all_journey_url').val();
    let csrf_token = $("#journey-list-csrf_token").val();
    const user_active_orders_url = $('#current-user-active-orders-url').val();
    console.log(current_user_id+' '+all_journey_url+' '+csrf_token+' '+user_active_orders_url);

    // GET ALL JOURNEY

    function render_journeys(url){

        function apend_pgnation_numbr_box(current_page, limit) {
            $('.page-number-boxes-wrapper').remove();
            for (var i = current_page; i <= limit; i++) {
                $('<li class="page-item page-number-boxes-wrapper">' +
                    '<a id="page-'+i+'-link" class="page-link page-number-boxes" data-url="' + all_journey_url + '?page=' + i.toString() + '">' + i + '</a>' +
                    '</li>').insertBefore('#end-link-wrapper')
            }
            $('.page-link').css({
                'color': 'black'
            });
            $('#page-'+current_page.toString()+'-link').css({
                'color':'#007bff'
            })
        }

        $.ajax({
        url: url,
        method:'GET',
        dataType: 'json',
        'X-CSRFToken': csrf_token,
        success: function (response) {
            let pagination = response.pagination;
            let current_page = parseInt(pagination.current_page);
            let num_of_pages = parseInt(pagination.num_of_pages);
            let html_string = '';
            console.log(response);
            $.map(response.results, function (journey) {
                html_string+=
                    '<div id="" class="row journey-list-each-journey-wrapper bg-light">\n' +
                    '<div id="" class="col-sm-3">\n' +
                    '<h5>Journey detail</h5>\n' +
                    '<div>From '+ journey.depart_area_name +'</div>\n' +
                    '<div>To '+ journey.destination_area_name +'</div>\n' +
                    '</div>\n' +
                    '<div id="" class="col-sm-8">\n' +
                    '<div id="" class="row">\n' +
                    '<div id="" class="col-sm-4">\n' +
                    '<img id="" class="journey-list-page-traveller-image" src="">\n' +
                    '</div>\n' +
                    '<div id="" class="col-sm-8">\n' +
                    '<h5>Traveller detail</h5>\n' +
                    '<div>'+ journey.traveller.first_name +' '+ journey.traveller.last_name +'</div>\n' +
                    '<div>About traveller - '+ journey.traveller.short_bio +'</div>\n' +
                    '<div>'+ journey.traveller.nationality +' </div>\n' +
                    '<div>Traveller Rating '+ journey.traveller.traveller_rating +'</div>\n' +
                    '<div>Shopper Rating '+ journey.traveller.shopper_rating +'</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '<input type="hidden" id="" class="journey-id" value="journey.id" >\n' +
                    '<div class="col-sm-1">\n';
                if(journey.traveller.id == current_user_id){
                    // disable button
                    html_string+='<button id="'+ journey.id +'" class="btn btn-primary journey-list-request-button"' +
                    ' data-toggle="modal" data-target="#journey-list-page-user-request-form-modal" disabled>Request</button>\n' +
                    '</div>\n' +
                    '</div>';
                }else{
                    html_string+='<button id="'+ journey.id +'" class="btn btn-primary journey-list-request-button"' +
                    ' data-toggle="modal" data-target="#journey-list-page-user-request-form-modal">Request</button>\n' +
                    '</div>\n' +
                    '</div>';
                }
            });
            $('#journey-list-each-journey-container').empty();
            $('#journey-list-each-journey-container').append(html_string);


            // pagination

            $('#next-link').attr('data-url', pagination.next);
            if(pagination.previous != null){
                $('#previous-link').attr('data-url', pagination.previous);
            }
            $('.pagination').find('.page-number-boxes').remove();
            if (num_of_pages-current_page<=3){
                apend_pgnation_numbr_box(current_page, num_of_pages)
            }else if (num_of_pages-current_page>3){
                apend_pgnation_numbr_box(current_page, current_page+1)
            }

            $('#start-link').attr('data-url', all_journey_url+'?page=1');
            $('#end-link').attr('data-url', all_journey_url+'?page='+num_of_pages)

        }
    });
    }

    render_journeys(all_journey_url);



    // PAGINATION

    $('.pagination').on('click', '.page-link', function (event) {
        let url = $(this).attr('data-url');
        $('.page-link').css({
            'color': 'black',
        });
        console.log(url);
        if(url != ''){
            render_journeys(url)
        }
    });

    // GET ALL ORDER OF THE CURRENT USER
    $.ajax({
        url: user_active_orders_url,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            let all_orders_string='';
            $.map(response, function (order) {
                all_orders_string+=
                    '<div class="form-check form-row order-box mt-3">\n' +
                    '<div class="col-sm-1">\n' +
                    '<input class="form-check-input order-input" type="radio" name="order" id="" value='+ order.id +'>\n' +
                    '</div>\n' +
                    '<div class="col-sm-11 journey-list-page-order-details-wrapper">\n' +
                    '<div class="form-row">\n' +
                    '<div class="col-sm-6">\n' +
                    '<img id="" class="journey-list-page-order-image" src="'+ order.package_image +'">\n' +
                    '</div>\n' +
                    '<div class="col-sm-6 journey-list-page-order-details">\n' +
                    '<div>'+ order.package_description +'</div>\n' +
                    '<div>Delivery price</div>\n' +
                    '<input id="" class="" style="border: none" name="orderer_price" value='+order.delivery_price+' readonly>\n';
                    $.map(order.negotiates, function (n) {
                        if (n.negotiation_status == 'active'){
                            console.log(n.negotiation_status);
                            all_orders_string+= '<input id="" class="negotiates-journey" type="hidden" data-journey_id="'+ n.journey +'">\n'
                        }
                    });

                    all_orders_string+='<input id="" class="" type="hidden" value="">\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '</div>';
                console.log(order.package_image);
            });
            $(all_orders_string).prependTo('#order-request-form');
        }
    });



    $('#journey-list-page-user-request-form-modal').on('show.bs.modal', function (event) {
        // show any order input that was previously hidden
        $('#order-request-form').find('.order-input').css({
            'display': 'block'
        });
        // remove negotiation message previously added
        $('.order-box').find('.journey-list-page-order-negotiation-message').remove();
        var selected_journey_id = $(event.relatedTarget).attr("id"); // Button that triggered the modal
        // check if any order is already in negotiation with the selected journey. Disable order selection if journey matched
        let all_negotiates_journey = $('#order-request-form').find('.negotiates-journey'); //get all negotiates from the modal body for all orders
        console.log(all_negotiates_journey);

        $.map(all_negotiates_journey, function (journey) {
            if (selected_journey_id == $(journey).data('journey_id')){
                $(journey).closest('.order-box').find('.order-input').css({
                    'display': 'none'
                });
                $(journey).append('<div class="journey-list-page-order-negotiation-message badge-info p-2 rounded">Already in negotiation process</div>')
            }
        });

        $('#order-request-form').find('.journey-selected').remove(); //remove any previous journey selected
        // add new selected journey id
        $('<input id="" class="journey-selected" type="hidden" value="'+selected_journey_id+'" name="journey">').insertBefore('#negotiation-status-value');
    })
});