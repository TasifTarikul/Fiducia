$(document).ready(function () {

    // on display of negotiator modal

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
        let negotitation_id = $(this).closest('.button-wrapper').find('.negotiation_id').val();
        let journey_id = $(this).closest('.button-wrapper').find('.journey_id').val();
        let order_id = $('.order_id').val();
        console.log(negotitation_id,journey_id,order_id);


        // $('.negotiation-wrapper').remove();
        //
        // $.ajax()

    });

    $('.nego-negotiate-button').on('click', function (event) {

    });

    $('.nego-reject-button').on('click', function (event) {

    });

});