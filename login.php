<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun


   $error = $username = $password = "";
   $errorCode = 0;
   $errorDesc = "";

    if (isset($_POST['user']))
    {
        $username = sanitizeString($_POST['user']);
        $password = sanitizeString($_POST['pass']);
        
        if ($username == "" || $password == ""){
            $errorCode = 1;
            $errorDesc = "Not all fields were entered";
        }else{
            //salt and hash for password
            $salt1    = "qm&h*";
            $salt2    = "pg!@";
            $token    = hash('ripemd128', "$salt1$password$salt2");

            //search input user in database
            $result = queryMySQL("SELECT username,password FROM members
            WHERE username='$username' AND password='$token'");
            if ($result->num_rows == 0)
            {
                $errorCode = 2;
                $errorDesc = "Username or Password is invalid";
            }else{
                $_SESSION['user'] = $username;
                
                $errorCode = 0;
                $errorDesc = "You are now logged in";
            }
        }    
    }
    echo json_encode(array('error' => $errorCode,
                            'errorDesc' => $errorDesc));
    
    $connection->close();

?>
