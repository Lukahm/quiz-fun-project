//Haomin liu,12109377,assignment 2,quizfun
var _isLogin;

$(document).ready(function(){
    //hide alert box
    $(".js-alert-box").hide();
    //hide subpage containers
    fillSubpage();
    //check user state
    checkUserState();
        
    function checkUserState(){
        //check login state 
        $.ajax({
                method: "GET",
                url: "checkLogin.php"
        })
        .done(function( msg ) {
            $('.js-userState').empty();
            var obj = JSON.parse(msg);
            _isLogin = obj.loggedin;
            setLoginState(_isLogin);
            $('<p class="navbar-text navbar-right"></p>').html("QuizTime"+obj.userstr).appendTo('.js-userState');
            if(_isLogin){
            $(".js-mainpage-info").hide();
            $(".js-mainpage-alert").hide();
            }
        });
    }
    
    //signup username input handler
    $( ".js-sigup-inputUsername" ).blur(function() {
        
        var username=$( this ).val();
        $('.js-userUnavailable').empty();
        $('.js-userAvailable').empty();
        //check user availability
        $.ajax({
                method: "POST",
                url: "checkUser.php",
                data:{ user:username}
        })
        .done(function( msg ) {
            var obj = JSON.parse(msg);
            if(obj=='This username is taken'){
                $('.js-userUnavailable').html('&#x2718'+obj);
            }else{
                $('.js-userAvailable').html('&#x2714'+obj);
            }
            
        });
    });
         
    
    //home button handler
    $('.home').on('click',function () {
        loadQuiz();
        fillSubpage("js-home");
        $(".js-mainpage-info").hide();
    });
    
    //homeLogin button handler
    $('.homeLogin').on('click',function () {
        fillSubpage("js-homeLogin");
        
        $('.js-homeLogin-panel-body').empty();
        $('.js-homeLogin-panel-score').empty();
        //search profile and add in container
            $.ajax({
                method: "POST",
                url: "profile.php",
                data: { action: 'profile' }
            })
            .done(function( msg ) {
                var obj = JSON.parse(msg);
                $('<p></p>').html(obj).appendTo('.js-homeLogin-panel-body');
                $('<button type="submit" class = "btn btn-primary btn-score-submit">Show My Score</button>').on('click',score).appendTo('.js-homeLogin-panel-body');

            });
    });
    
    //find user score function
    var score = function(e){
        e.preventDefault();
        $('.js-homeLogin-panel-score').empty();
        $.ajax({
            method: "POST",
            url: "quiz.php",
            data: { action: 'score'}
        })
        .done(function( msg ) {
            var obj = JSON.parse(msg);
            //display user score
            $('<p></p>').html("Your highest score is:"+obj+"points").appendTo('.js-homeLogin-panel-score');
        });
    };
       

    
    //signup button handler
    $('.signup').on('click',function () {
        fillSubpage("js-signup");
        $(".js-mainpage-info").hide();
    });

    //login button handler
    $('.login').on('click',function (e) {
        e.preventDefault();
        fillSubpage("js-login");
        $(".js-mainpage-info").hide();
    }); 
    
    //members button handler
    $('.members').on('click',function () {

        fillSubpage("js-members");
        
        $('.js-members-table').empty();
        //search members 
        $.ajax({
            method: "POST",
            url: "members.php",
            data: { action: 'member' }
        })
        .done(function( msg ) {
            
            $('<tr><th>#</th><th>Username</th><th>Highest Score</th></tr>').appendTo('.js-members-table');
        
            var obj = JSON.parse(msg);
            var memberNum = Object.keys(obj).length;
            //display member table
            for(var i = 0; i < memberNum; i++) {
                var member = obj[Object.keys(obj)[i]];
                var member_class = "member"+i;
                $('<tr><td>'+(i+1)+'</td>').appendTo('.js-members-table').addClass(member_class);
                $('<td>'+member.username+'</td>').appendTo('.'+member_class);
                $('<td>'+member.score+'</td>').appendTo('.'+member_class);
            }

        });
         
    });
    
    //quiz button handler
    $('.quiz').on('click',function () {
        loadQuiz();
        fillSubpage("js-quiz");
    }); 
    
    //profile button handler
    $('.profile').on('click',function (e) {
        e.preventDefault();
        fillSubpage("js-edit-profile");
        $('.js-profile-textarea').empty();
        //search profile 
        $.ajax({
            method: "POST",
            url: "profile.php",
            data: { action: 'profile' }
        })
        .done(function( msg ) {
            var obj = JSON.parse(msg);
            $('.js-profile-textarea').html(obj);
        });
    });
    
    
    //unsubscribe button handler
    $('.unsub').on('click',function (e) {
        
        e.preventDefault();
        //unsubscribe
        $.ajax({
            method: "POST",
            url: "unsubscribe.php",
            data: { action: 'unsubscribe' }
        })
        .done(function( msg ) {
            var obj = JSON.parse(msg);
            if(obj.unsubscribe){
                showAlert("You have successfully unsubscribed your account", "", 0, 3000);
                setLoginState(false);
                checkUserState();
                $(".js-mainpage-alert").show();
                $(".js-mainpage-info").show();

            }else{
                showAlert("Unsubscribe failed", "", 1, 3000);
            }
        });
        fillSubpage();
    });
    
    //logout button handler
    $('.logout').on('click',function (e) {
        
        e.preventDefault();
        //logout
        $.ajax({
            method: "POST",
            url: "logout.php",
            data: { action: 'logout' }
        })
        .done(function( msg ) {
            var obj = JSON.parse(msg);
            if(obj.logout){
                showAlert("You have successfully logged out", "", 0, 3000);
                setLoginState(false);
            }
        });
        fillSubpage();
        checkUserState();
        $(".js-mainpage-alert").show();
        $(".js-mainpage-info").show();
    });
    
    
    //loading button handler
    $('button[data-loading-text]')
    .on('click', function () {
        var btn = $(this);
        btn.button('loading');
    });

    
    // signup form submit handler
    $( "#signupForm" ).submit(function( e ) {
        
        // Stop form from submitting normally
        e.preventDefault();
        
        //button loading 
        $('#signupForm button[data-loading-text]')
            .on('click', function () {
                var btn = $(this);
                btn.button('loading');
            });
        
        // Get some values from elements on the page:
        var $form = $( this ),
            username = $form.find( "input[name='username']" ).val(),
            password = $form.find( "input[name='password']").val(),
            url = $form.attr( "action" );        
        
        //validate username and password
        var ok = validate(username,password);

        if(!ok){ 
            $('#signupForm button[data-loading-text]').button('reset');
            return;
        } 
        
        // Send the data using post
        var posting = $.post( url, { user:username , pass:password } );

        //process post result
        posting.done(function( msg ) {
            var obj = JSON.parse(msg);
            $('#signupForm button[data-loading-text]').button('reset');
            
            if(obj=='This username is taken'){
                showAlert("This username is taken","", 1, 10000);
            }else{
                showAlert("You have successfully signed up and you can login now","", 0, 3000);
                $('.login').click();
            }
            
        });
    });
    
    
    // login form submit handler
    $( "#loginForm" ).submit(function( e ) {

        // Stop form from submitting normally
        e.preventDefault();
        
        //button loading
        $('#loginForm button[data-loading-text]')
            .on('click', function () {
                var btn = $(this);
                btn.button('loading');
            });

        // get some values from elements on the page:
        var $form = $( this ),
        username = $form.find( "input[name='username']" ).val(),
        password = $form.find( "input[name='password']").val(),
        url = $form.attr( "action" );        

        
        //send the data using post method
        var posting = $.post( url, { user:username , pass:password } );

        // process post result
        posting.done(function( msg ) {
            //$( ".js-login-form-horizontal" ).hide( "fast" );
            $('#loginForm button[data-loading-text]').button('reset');
            
            $(".js-mainpage-alert").hide();

            var obj = JSON.parse(msg);
                
            //error handler
            switch(obj.error){
                case 0:
                    showAlert("You have successfully logged in", "", 0, 3000);
                    setLoginState(true);
                    fillSubpage();
                    checkUserState();
                    $('.homeLogin').click();
                    break;
                case 1:
                    showAlert("Not all fields were entered", "", 1, 10000);
                    break;
                case 2:
                    showAlert("Username or Password is invalid", "", 1, 10000);
                    break;

            }

        });
    });
    
    
    // profile form submit handler
    $( "#profileForm" ).submit(function( e ) {
        
        // Stop form from submitting normally
        e.preventDefault();
        
        //button loading
        $('#profileForm button[data-loading-text]')
            .on('click', function () {
                var btn = $(this);
                btn.button('loading');
            });
        // get some values from elements on the page
        var $form = $( this ),
            profile = $form.find( "textarea#profile" ).val(),
            url = $form.attr( "action" ); 
                
        // send the data using post
        var posting = $.post( url, { profile:profile  } );

        // process post result
        posting.done(function( msg ) {
            showAlert("Submitted successfully", "", 0, 3000);
            $('#profileForm button[data-loading-text]').button('reset');       
        });
    });
    
});


var debugging = false;
//get value of username and password, then validate
function validate(username, password)
{
    if(debugging) return;
    var fail = validateUsername(username)
    fail += validatePassword(password)
    if (fail == "")     return true
    else { showAlert(fail, "", 1, 10000);; return false }
};

//username validate
function validateUsername(input)
{
    if (input == "") return "No Username was entered."
        else if (input.length < 5)
    return "Usernames must be at least 5 characters."
        else if (/[^a-zA-Z0-9_-]/.test(input))
        return "Only a-z, A-Z, 0-9, - and _ allowed in Usernames."
    return ""
};

//password validate
function validatePassword(input)
{
    if (input == "") return "No Password was entered."
    else if (input.length < 6)
    return "Passwords must be at least 6 characters."
        else if (!/[a-z]/.test(input) || ! /[A-Z]/.test(input) ||
                !/[0-9]/.test(input))
        return "Passwords require one each of a-z, A-Z and 0-9.";
    return ""; 
};

//alert-box
function showAlert(alertText, linkText, type, timeout){
    var alertType;

    switch (type){
        case 0: alertType = "alert-success";break;
        case 1: alertType = "alert-danger";break;
    }

    $(".js-alert-box").removeClass(function (index, css) {
        return (css.match (/(^|\s)alert-\S+/g) || []).join(' ');
    });
    $(".js-alert-box").addClass(alertType);
    $(".js-alert-box .alert-span").text(alertText);
    $(".js-alert-box .alert-link").text(linkText);

    $(".js-alert-box").show(500);
    if(timeout && timeout>0){
        window.setTimeout(function(){
            $(".js-alert-box").hide(1500);
        },timeout)
    }

}

//set login state(change nav-bar)
function setLoginState(isLogin){
    if(isLogin){
        $('.js-nav').removeClass('guest-mode-nav').addClass('login-mode-nav');
    }else{        
        $('.js-nav').removeClass('login-mode-nav').addClass('guest-mode-nav');
    }
}

//fill subpage container
function fillSubpage(subPageId){
    $('.js-subpage-container').hide();
    if(subPageId){
        $('.' + subPageId).show();
    }
}

