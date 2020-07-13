$(document).ready(function () {

    // SEND PACKAGE FORM PAGE AND CREATE ORDER FORM PAGE //

    const input_file = $(".create-order-form-input-file");
    const preview_image = $(".image-preview_image");
    const previewDefaultText = $(".image-preview-default-text");

    function filePreview(input) {
        console.log(input.files);
        console.log(input.files[0]);
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                previewDefaultText.css('display', 'none');
                preview_image.css('display', 'block');
                preview_image.attr('src', e.target.result)
            };
            reader.readAsDataURL(input.files[0]);
        }else{
            // preview_image.css('display', null);
            // preview_image.attr('src', "");
            // previewDefaultText.css('display', null)
        }
    }

    input_file.change(function () {
        filePreview(this);
    });

    // FROM SET
    //          add item        //
    
    // $('#add-item-button').click(function () {
    //     var new_formID = $("#id_form-TOTAL_FORMS").val();
    //     var new_form = $("#selfpack_emptyform").clone().html().replace(/__prefix__/g, new_formID);
    //     $("#self-pack-form-submit-button").before(new_form);
    //     $('#form-'+new_formID).addClass('added-form');
    //     $("#id_form-TOTAL_FORMS").val(parseInt(new_formID)+1);
    // });
    //
    //
    // function updateElementiD(elemntset, index){
    //     console.log($("#"+elemntset.id).find(" *"));
    //     $("#"+elemntset.id).find(" *").each(function () {
    //         var id_regex = /form-\d/;
    //         var replacement = 'form-'+index;
    //         if ($(this).attr('for')){
    //             $(this).attr('for', $(this).attr('for').replace(id_regex, replacement))
    //         }
    //         if (this.id) {
    //             this.id =  this.id.replace(id_regex, replacement);
    //         }
    //         if (this.name) {
    //             this.name = this.name.replace(id_regex, replacement);
    //         }
    //     });
    //     $("#"+elemntset.id).attr('id','form-'+index);
    //     $("#"+elemntset.id).find(".form-remove-button").prop('value', 'form-'+index);
    //
    // }
    //
    // $('#main-form').on('click', '.form-remove-button' ,function (event) {
    //     $("#id_form-TOTAL_FORMS").val($("#id_form-TOTAL_FORMS").val()-1);
    //     $("#"+this.value).remove();
    //     var all_addedForm_length = $(".added-form").length;
    //     var all_addedForm = $("#main-form .added-form");
    //     if (all_addedForm_length >= 1){
    //         for (var i = 0; i < all_addedForm_length; i++){
    //             updateElementiD(all_addedForm[i], i+1);
    //         }
    //     }
    // });


});
