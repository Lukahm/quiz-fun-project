<?php 
require_once 'functions.php';

    /*
    signup process
    1.check isset user and pass
    2.validate user pass
    3.check user
    4.encryption
    5.insert to DB
    6.echo back.
    */
    
    $error=$username = $password = "";
    if (isset($_SESSION['user'])) destroySession();
    if (isset($_POST['user']))
    $username = sanitizeString($_POST['user']);
    if (isset($_POST['pass']))
    $password = sanitizeString($_POST['pass']);
        
    //set validation variable
    $fail = validate_username($username);
    $fail .= validate_password($password);
    $fail .= check_user($username);
    
    //validate received post data
    if ($fail == "")
    {
        //enter the posted fields(username,password) into a database,using hash encryption for the password.
        $salt1    = "qm&h*";
        $salt2    = "pg!@";
        $token    = hash('ripemd128', "$salt1$password$salt2");
        $score = '';
        add_user($connection,$username, $token,$score); 
        $fail = "Signed up successfully"; 
    }
    
    //validate username
    function validate_username($field)
    {
        if ($field == "") return "No Username was entered<br>";
        else if (strlen($field) < 5)
          return "Usernames must be at least 5 characters<br>";
        else if (preg_match("/[^a-zA-Z0-9_-]/", $field))
          return "Only letters, numbers, - and _ in usernames<br>";
        return "";
    }
    
    //validate password
    function validate_password($field)
    {
        if ($field == "") return "No Password was entered<br>";
        else if (strlen($field) < 6)
          return "Passwords must be at least 6 characters<br>";
        else if (!preg_match("/[a-z]/", $field) ||
                 !preg_match("/[A-Z]/", $field) ||
                 !preg_match("/[0-9]/", $field))
          return "Passwords require 1 each of a-z, A-Z and 0-9<br>";
          return ""; 
    }
    
    //add user in database
    function add_user($connection, $un, $pw,$sc)
    {
        queryMysql("INSERT INTO members VALUES( '$un', '$pw','$sc')");
    }
    
    //check user availability in database
    function check_user($field){
        //check whether input username exists
        $result=queryMysql("SELECT username FROM members WHERE username='$field'");
        if($result->num_rows)
            return "This username is taken";  
        else
            return "";
        $result->close();
    }
    
    echo json_encode($fail);
    
    
    $connection->close();


?>