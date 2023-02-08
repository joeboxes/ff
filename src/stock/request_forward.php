<?php
// request_forward.php

$urlParamKey = "url";

if (isset($_GET[$urlParamKey])) {
	$url = $_GET[$urlParamKey];
//    echo $url;

//    echo "<br/>";

	// $content = file_get_contents($url);
	// echo $content;

    /*
	$ch = curl_init();
	$curlConfig = array(
	    CURLOPT_URL            => $url,
	    CURLOPT_POST           => false,
	    CURLOPT_RETURNTRANSFER => true,
	    CURLOPT_POSTFIELDS     => array(
	        // 'field1' => 'some date',
	        // 'field2' => 'some other data',
	    )
	);
	curl_setopt_array($ch, $curlConfig);
	$result = curl_exec($ch);
	curl_close($ch);
	echo $result;

	*/

	ob_start();
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	echo $response;

} else {
    // Fallback behaviour goes here
}

?>