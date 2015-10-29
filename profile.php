<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun


/*
Edit Profile—A textarea should be displayed and allow the user to enter text, that will be stored in the profiles table.
*/


//check if user logged in
if (!$loggedin) die();


if ( isset($_SESSION['user'])){

$result = queryMysql("SELECT * FROM profiles WHERE username='$user'");

if(isset($_POST['profile'])){
    $profile = sanitizeString($_POST['profile']);
    $profile = preg_replace('/\s\s+/', ' ', $profile);
      
    //store the input text in the profiles table if user profile exists(update or insert)
    if ($result->num_rows){
        queryMysql("UPDATE profiles SET profile_text='$profile' WHERE username='$user'");
    }else {
        queryMysql("INSERT INTO profiles(username,profile_text) VALUES('$user', '$profile')");
    }
    
    
}else{
    
    if ($result->num_rows)
    {
        $row  = $result->fetch_array(MYSQLI_ASSOC);
        $profile = stripslashes($row['profile_text']);
    }else{
        $profile = "";
    }
}

$profile = stripslashes(preg_replace('/\s\s+/', ' ', $profile));

echo json_encode($profile);

$result->close();
$connection->close();

}

?>
