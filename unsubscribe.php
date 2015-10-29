<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun



if (!$loggedin) die();

if(isset($_POST['action'])){
	$action=sanitizeString($_POST['action']);

	if ($action=='unsubscribe'){
	  if ( isset($_SESSION['user'])){
	  	queryMysql("DELETE FROM members WHERE username='$user'");
	  	queryMysql("DELETE FROM profiles WHERE username='$user'");
	    destroySession();
	    echo json_encode(array('unsubscribe' => true));    
	  }
	  else echo json_encode(array('unsubscribe' => false));
	}
}



?>