<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun

/*
Quiz-it displays a quiz- When the user presses Submit button the score achieved should be displayed and store in the member table.
*/
	$min = 1;
	$max = 20;
	if(isset($_POST['action'])){

		$action=sanitizeString($_POST['action']);
		
		//get user score
		if($action == 'score'){

			$result = queryMysql("SELECT score FROM members WHERE username='$user'");

			$row  = $result->fetch_array(MYSQLI_ASSOC);
        	$score = stripslashes($row['score']);

        	echo json_encode($score);
        	return;
		}

     	if($action == 'getQuestion'){

			// define question array that will contain the results of query
			$question;
 			
			//genetate five random numbers
			$random_num_array=[];
			for($i = 0; $i <5; $i++){
				$randomNum =  rand( $min,$max );
				if(in_array($randomNum, $random_num_array )) $i--;
				else{
					$random_num_array[] = $randomNum;
				}
			}
			
			//get five random questions from question table
			$result = queryMysql("select question.question_id, question.question_text, question_option.option_id , question_option.option_text 
			from question, question_option
			where question.question_id = question_option.question_id 
			and (question.question_id = $random_num_array[0]
		         or question.question_id = $random_num_array[1]
		         or question.question_id = $random_num_array[2]
		         or question.question_id = $random_num_array[3]
		         or question.question_id = $random_num_array[4])");
			
			//insert selected questions in question array
			while($row = $result->fetch_array(MYSQL_ASSOC)) {
				$question_id = $row['question_id'];
				$option_id = $row['option_id'];
				$question[$question_id]['question_id'] = $question_id;
			    $question[$question_id]['question_text'] = $row['question_text'];
			    $question[$question_id]['question_option'][$option_id] = $row['option_text'];
			}

			//format data
			echo json_encode($question);

			$result->close();
			$connection->close();
     
	    } else if($action == 'submit'){
			
			//check login state
	    	if(!$loggedin){
	    		echo json_encode(array('error' => "please login first.",'isSucceed' => false));
	    		return;
	    	}

	        //get option answers from question table
			$result = queryMysql("SELECT option_id,is_right_option,option_text FROM question_option");
			
			//define user current socre,questionAnswers,questionFeedback
			$currentScore=0;
			$questionAnswers=$_POST['questionAnswers'];
			$questionFeedback;

            
			//compare data option answers with user answers 
			while($row = $result->fetch_array(MYSQL_ASSOC)) {
			   for ($j=0; $j < sizeof($questionAnswers); $j++) { 
			        if($row['option_id']==$questionAnswers[$j]){
			            if($row['is_right_option'] =='1'){
			            	$currentScore=$currentScore+20;
							$questionFeedback[$j]['isRight']='true';
							$questionFeedback[$j]['description']='Correct Answer!';
							$questionFeedback[$j]['option']=$row['option_text'];
							$questionFeedback[$j]['answeredQuestion']='question'.($j+1);
			            }else{
							$questionFeedback[$j]['isRight']='false';
							$questionFeedback[$j]['description']='Wrong Answer!';
							$questionFeedback[$j]['option']=$row['option_text'];
							$questionFeedback[$j]['answeredQuestion']='question'.($j+1);

						}
			        }         
			   }         
			}
			
			//define user highest socre
			$highestScore=0;
			//get user score from members table
			$result=queryMysql("SELECT score FROM members WHERE username='$user'");
			while($row = $result->fetch_array(MYSQL_ASSOC)) {
				$highestScore=$row['score'];
			}
			
			//store highest score
			if($currentScore>$highestScore){
				queryMysql("UPDATE members SET score='$currentScore' WHERE username='$user'");
				$highestScore=$currentScore;
			}
			
	        //format data and send score 
	        echo json_encode(array('currentScore' => $currentScore ,'highestScore' => $highestScore ,'isSucceed' => true,'feedback'=>$questionFeedback));
			$connection->close();
	    }
	}
?>


