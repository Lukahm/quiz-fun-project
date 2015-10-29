<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun


	$userAvailability;
	
	if (isset($_POST['user']))
	{
	    $user   = sanitizeString($_POST['user']);
	    $result = queryMysql("SELECT * FROM members WHERE username='$user'");

	    if($result->num_rows){
			$userAvailability="This username is taken";
		}else{
		    $userAvailability="This username is available";
		}
		echo json_encode($userAvailability);
	}

	
	


?>