var params = {
    grant_type:"authorization_code",
    client_id:"7b9f300cbf514ca8bc8b10275999a6dd",
    client_secret:"xqJW0JlBor2kRUAlnOwNtgU6FSeOwFRkdArcTJrQb4Qx8fBBI8",
    code: null,
    redirect_uri:"http://www.infojobs.net/core/oauth2vc/index.xhtml"
}

$(function() {
    $('#submitBtn').click(function(){
        params.code = $('#token').val();
        $.ajax
        ({
          type: "POST",
          url: "https://www.infojobs.net/oauth/authorize",
          dataType: 'json',
          async: false,
          data: params,
          success: function (data){
            $('#accessToken').text("Your access token is: " + data.access_token);
            // TRY CALL WITH NEW TOKEN...
            /*$.ajax
            ({
            type: "GET",
            url : "https://api.infojobs.net/api/2/coverletter",
            dataType: 'json',
            async: false,
            headers: {
                "Authorization": "Basic " + btoa("7b9f300cbf514ca8bc8b10275999a6dd:xqJW0JlBor2kRUAlnOwNtgU6FSeOwFRkdArcTJrQb4Qx8fBBI8") + ",Bearer " + data.access_token,
                "Content-Type" : "application/json"
            },
            success: function (data){
                console.log(data)
            }
            });*/

          }
        });
        
    })
});