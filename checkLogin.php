<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun


echo json_encode(array('loggedin' => $loggedin,'userstr'=> $userstr) );

?>