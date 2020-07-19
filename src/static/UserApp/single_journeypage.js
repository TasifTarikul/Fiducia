$(document).ready(function () {

    const create_journey_order_url = $('.create_journey_order').val();
    let csrf_token = $('#single-journey-csrf-token').val();
    // JOURNEY SECTION NAVBAR

    $('.journey-section-navbar-button').on('click', function () {
        $('.journey-section-panel-section').hide();
        if($(this).attr('id') == 'journey-section-package-button'){
            $('#journey-section-package-section').show();
        }else if($(this).attr('id') == 'journey-section-negotiation-button'){
            $('#journey-section-negotiation-section').show();
        }
        $('.journey-section-navbar-button').removeClass('hover-effect-selected').addClass('hover-effect');
        $(this).removeClass('hover-effect');
        $(this).addClass('hover-effect-selected');
    });

    // JOURNEY SECTION PANEL SECTION

    $('#journey-section-negotiation-section').hide();

    // NEGOTIATION SECTION

        // ACCEPT BUTTON

    $('.journey-section-accept-button').on('click', function (){
        let negotiation_id = $(this).closest('.journey-section-each-negotiation-wrapper')
            .find('.journey-section-negotiation-id').val().trim();

        let order_id = $(this).closest('.journey-section-each-negotiation-wrapper')
            .find('.journey-section-order-id').val().trim();

        let orderer_price = $(this).closest('.journey-section-each-negotiation-wrapper').
        find('.journey-section-orderer-offered').text().trim();

        let journey_id = $('.journey-section-journey-id').val().trim();

        console.log(negotiation_id, order_id, orderer_price.trim(), journey_id.trim())

        let data = {
            journey:journey_id,
            order:order_id,
            negotiation_id: negotiation_id,
            negotiation_status: 'accepted_by_negotiator',
            delivery_price: orderer_price,
            Accept: 'Accept' // all accept button send this key to full fill API condition. see create_journey_order api
        };

        $.ajax({
            url: create_journey_order_url,
            headers: {"X-CSRFToken": csrf_token},
            method: 'POST',
            data: data,
            success: function (response) {
                if (response == 'success') {
                    location.reload(true)
                }
            }
        })
    });

        // NEGOTIATE BUTTON

    $('.journey-section-negotiate-button').on('click', function () {
        let negotiator_price_text = $(this).closest('.journey-section-each-negotiation-wrapper')
            .find('.journey-section-negotiator-offered-text');
        let negotiation_input_group = $(this).closest('.journey-section-each-negotiation-wrapper')
            .find('.journey-section-negotiation-input-group');
        let negotiation_input_group_display = negotiation_in
        put_group.css('display');

        if (negotiation_input_group_display=='none'){
            negotiation_input_group.css('display', 'block');
            negotiator_price_text.css('display', 'none');
        }else{
            negotiation_input_group.css('display', 'none');
            negotiator_price_text.css('display', 'block');
        }
    });

        // NEGOTIATION SUBMIT BUTTON
    $('.journey-section-negotiation-submit-button').on('click', function () {
        let my_price = $(this).closest('.journey-section-each-negotiation-wrapper')
            .find('.journey-section-negotiator-offered').val();

        let url = $(this).closest('.journey-section-each-negotiation-wrapper')
            .find('.journey-section-negotiation-api-url').val()
        console.log(my_price, url)

        data = {
            negotiator_price: my_price
        };

        $.ajax({
            url: url,
            headers: {"X-CSRFToken": csrf_token},
            data:data,
            method: 'PATCH',
            success: function () {
                location.reload(true);
            }
        })
    });

        // REJECT BUTTON

    $('.journey-section-reject-button').on('click', function () {

    });


    // MODAL FOR PACKAGE DETAIL IN NEGOTIATION SECTION

    $('#negotiation-modal').on('show.bs.modal', function (event) {
        console.log(event);
        var button = $(event.relatedTarget); // Button that triggered the modal
        var package_detail = button.data('package').split(',');// Extract info from data-* attributes
        var orderer_detail = button.data('orderer').split(',');
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        // set order detail
        modal.find('#negotiation-modal-package-image').attr('src', package_detail[0]);
        modal.find('#negotiation-modal-package-description').text(package_detail[1]);
        modal.find('#negotiation-modal-order-type').text(package_detail[2]);
        //check order type
        if (package_detail[2] == 'cybershop'){
            modal.find('#negotiation-modal-order-type')
                .after('<div id="" class="negotiation-modal-cybebrshop-item-price-wrapper">\n' +
                '<label id="" class="">Item price</label>\n' +
                '<div id="" class="negotiation-modal-cybebrshop-item-price">'+ package_detail[3]+'</div>\n' +
                '</div>');
        }

        // set orderer detail

        modal.find('#negotiation-modal-orderer-name').text(orderer_detail[0]);
        modal.find('#negotiation-modal-orderer-shopper-rating').text(orderer_detail[1]);
        modal.find('#negotiation-modal-orderer-traveller-rating').text(orderer_detail[2]);
        modal.find('#negotiation-modal-orderer-shortbio').text(orderer_detail[3]);
        modal.find('#negotiation-modal-orderer-nationality').text(orderer_detail[4]);
        console.log(package_detail);
        console.log(orderer_detail);
    })



});