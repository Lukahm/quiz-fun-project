//Haomin liu,12109377,assignment 2,quizfun

function loadQuiz(){
    //get questions in database
    $.ajax({
            method: "POST",
            url: "quiz.php",
            data: { action: 'getQuestion' }
        })
    .done(function( msg ) {

        var obj = JSON.parse(msg);
        console.log(obj);
        var questionNum = Object.keys(obj).length;
        $('.js-questionFeedback-container').empty();
        $('.js-question-container').empty();
        for(var i = 0; i < questionNum; i++) {
            var question = obj[Object.keys(obj)[i]];
            var question_id =  question.question_id;
            var question_class = "question"+i;

            //question wrapper
            $('<div class="js-question-wrapper" ></div>').appendTo('.js-question-container').addClass(question_class);
            $('<h4></h4>').html((i+1)+". "+ question.question_text).appendTo('.'+question_class);

            var optionNum = Object.keys(question.question_option).length;
            for(var j = 0; j<optionNum;j++ ){
                var index = Object.keys(question.question_option)[j];
                var option_text = question.question_option[index];
                var option_id = index;

                var option_label_id = "option_id_"+option_id;
                var $question = $('.'+question_class);
                $('<label><input class="quiz-input" type="radio" name="'+question_class+'" value="'+option_id + '" id="'+option_label_id+'"/> '+option_text+' </label></br>').appendTo('.'+question_class);
            }
        } 

        //submit button
        $('</br><p></p>').html("Submit your answers for this quiz").appendTo('.js-question-container');
        $('<button type="submit" data-loading-text="Loading..." class = "btn btn-primary btn-quiz-submit">SUBMIT</button>').on('click',submit).appendTo('.js-question-container');

        //clear button
        $('<p></p>').html("Clear the answers to start again").appendTo('.js-question-container');
        $('<button type="reset" class="btn btn-default" value="Reset">CLEAR</button>').appendTo('.js-question-container');

        //refresh button
        $('<p></p>').html("Get another quiz").appendTo('.js-question-container');
        $('<a href="#" class="btn btn-info">Take quiz again</a><p></p>').on('click',refresh).appendTo('.js-question-container');
    });    

}

//sumbit quiz event handler
var submit = function(e){
    e.preventDefault();

    //get value of each question
    var question_answers = [];
    
    //format data
    for (var i = 0; i <5; i++) {
        var question ="question"+i;    
        question_answers.push ( $('input[name='+question+']:checked').val() );

    };  
    
    $('.js-questionFeedback-container').empty();
    
    //send answers to question database and get result   
    $.ajax({
        method: "POST",
        url: "quiz.php",
        data: { action: 'submit', questionAnswers :question_answers }
    })
    .done(function( msg ) {
        var obj = JSON.parse(msg);
        $('#quizForm button[data-loading-text]').button('reset');
        
        if(!obj.isSucceed){            
            $('<p></p>').html("Please login first to answer the quiz. This page will be navigated to Login Page in 5 seconds").appendTo('.js-question-container');
            window.setTimeout(function(){
                $(".login").click();
            },5000);
        }else{

             $('<div class="panel panel-success"><div class="panel-heading">Quiz Feedback</div></div>').appendTo('.js-questionFeedback-container').addClass('feedback-container');

            //display user scores
            $('<h4></h4>').html("Scores").appendTo('.feedback-container');
            $('<p class="text-success"></p>').html("Your current score is:"+obj.currentScore+"points").appendTo('.feedback-container');
            $('<p class="text-success"></p>').html("Your highest score is:"+obj.highestScore+"points").appendTo('.feedback-container');

            //display feedback for each question
            $('<h4></h4>').html("Feedback Details of Answered questions").appendTo('.feedback-container');
                        
            for(var key in obj.feedback){    

                $('<p></p>').html(obj.feedback[key].answeredQuestion).appendTo('.feedback-container');
                $('<p></p>').html("You answered:"+obj.feedback[key].option).appendTo('.feedback-container');

                if(obj.feedback[key].isRight=='true'){
                    $('<p class="text-success"></p>').html(obj.feedback[key].description).appendTo('.feedback-container');

                }else{
                    $('<p class="text-danger"></p>').html(obj.feedback[key].description).appendTo('.feedback-container');
                }
            }

        }

    });   
    
};

//refresh quiz event handler
var refresh = function(e){
    e.preventDefault();
    loadQuiz();
};
