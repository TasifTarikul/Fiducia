$(document).ready(function () {

    // on display of negotiator modal
    const create_journey_order_url = $('.create_journey_order').val();
    var csrf_token = $('#single-order-csrf-token').val();

    $('#negotiator-modal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget); // Button that triggered the modal
      var a_modal = button.data('whatever');// Extract class name that will be shown in the modal, from data-* attributes
      console.log(a_modal);
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      $('.negotiator-modal-body').hide();
      $('#'+a_modal).show();
      // modal.find('.modal-title').text('New message to ' + recipient)
      // modal.find('.modal-body input').val(recipient)
    });

    $('.nego-accept-button').on('click', function (event) {
        let negotiation_id = $(this).closest('.button-wrapper').find('.negotiation_id').val();
        let journey_id = $(this).closest('.button-wrapper').find('.journey_id').val();
        let order_id = $('.order_id').val();
        let negotiator_price = $(this).closest('.negotiation-wrapper').find('.negotiator-price').text();
        console.log(negotiation_id,journey_id,order_id, negotiator_price);


        // $('.negotiation-wrapper').remove();

        data = {
            journey:journey_id,
            order:order_id,
            negotiation_id: negotiation_id,
            negotiation_status: 'accepted_by_orderer',
            delivery_price: negotiator_price,
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

    // NEGOTIATION SECTION

    $('.nego-negotiate-button').on('click', function (event) {
        let _display = $(this).closest('.negotiation-wrapper').find('.nego-negotiate-submit-button').css('display');
        let _price_i_element = $(this).closest('.negotiation-wrapper').find('.orderer-price');
        let price_input = $(this).closest('.negotiation-wrapper').find('.orderer-price-input');
        let negotiation_submit_button = $(this).closest('.negotiation-wrapper').find('.nego-negotiate-submit-button');

        // Show option to negotiate
        if(_display=='none'){
            _price_i_element.css('display', 'none');
            price_input.css('display', 'inline-block');
            negotiation_submit_button.css('display', 'inline-block');
        }else{
            negotiation_submit_button.css('display', 'none');
            price_input.css('display', 'none');
            _price_i_element.css('display', 'inline-block');
        }

    });

    $('.nego-negotiate-submit-button').on('click', function () {
        let this_button = $(this);
        let my_price = this_button.closest('.negotiation-wrapper').find('.orderer-price-input').val();
        let url = this_button.closest('.negotiation-wrapper').find('.negotiation_single-object_url').val();
        console.log(my_price, url);

        let data = {
            orderer_price: my_price
        };

        $.ajax({
            url: url,
            headers: {"X-CSRFToken": csrf_token},
            method: 'PATCH',
            data:data,
            success: function () {
                console.log('ajax on success');
                this_button.css('display', 'none');
                this_button.closest('.negotiation-wrapper').find('.orderer-price-input').css('display', 'none');
                this_button.closest('.negotiation-wrapper').find('.orderer-price').text(my_price).css('display', 'inline-block');
            }
        })
    });



    $('.nego-reject-button').on('click', function (event) {

    });

});