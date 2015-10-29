<?php //functions.php
//Haomin liu,12109377,assignment 2,quizfun

    //database login 
    $dbhost  = 'localhost'; 
    $dbname  = 'db339';  
    $dbuser  = 'a2user';  
    $dbpass  = 'a2339'; 

    $connection = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
    if ($connection->connect_error) die($connection->connect_error);

    function createTable($tableName, $createQuery)
    {
      	queryMysql("CREATE TABLE IF NOT EXISTS $tableName($createQuery)");
      	echo "Table '$tableName' created or already exists.<br>";
    }
    
    function insertTable($tableName,$insertQuery)
    {
   		queryMysql("INSERT INTO $tableName VALUES $insertQuery");
      	echo "Table '$tableName' created or already exists.<br>";
    }

    function queryMysql($query)
    {
        global $connection;
        $result = $connection->query($query);
  	    if (!$result) die($connection->error);
        return $result;
    }

    function sanitizeString($var)
    {
        global $connection;
        $var = trim(strip_tags($var));
        $var = htmlentities($var);
        $var = stripslashes($var);
        return $connection->real_escape_string($var);
    }

    function destroySession()
    {
        $_SESSION=array();
        if (session_id() != "" || isset($_COOKIE[session_name()]))
          setcookie(session_name(), '', time()-2592000, '/');
        session_destroy();
    }
?>

