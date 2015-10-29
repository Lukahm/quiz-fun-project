<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun

  

if ($_POST['action']=='logout'){
  if ( isset($_SESSION['user'])){
    destroySession();
    echo json_encode(array('logout' => true));    
  }
  else echo json_encode(array('logout' => false));
}
  
?>