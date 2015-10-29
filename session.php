<?php 
require_once 'functions.php';
//Haomin liu,12109377,assignment 2,quizfun

  
  session_start();
  $userstr=" (Guest)";
  if (isset($_SESSION['user']))
  {
    $user     = $_SESSION['user'];
    $userstr=" ($user)";
    $loggedin = TRUE;
  }
  else $loggedin = FALSE;


?>