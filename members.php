<?php 
require_once 'session.php';
//Haomin liu,12109377,assignment 2,quizfun


if (!$loggedin) die();


if ( isset($_SESSION['user'])){

if($_POST['action']=='member'){

	
	// define members array that will contain the results of query
 	$members;

	$result = queryMysql("SELECT username,score FROM members ORDER BY score desc");

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$username=$row['username'];

		$members[$username] = array(
	        'username' => $row['username'],
	        'score' => $row['score']
	    );
	}

echo json_encode($members);
$connection->close();
}
}

?>
