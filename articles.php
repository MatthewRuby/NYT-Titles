<?php
	require "apiKey.php";

	$article = array();
	$article["title"] = array();
	// $article["url"] = array();
	// $article["abstract"] = array();
	// $article["date"] = array();
	$article["views"] = array();

	$word = array();
	$word["word"] = array();
	$word["views"] = array();
	$word["before"] = array();
	$word["after"] = array();

	$quote = chr(34);
	$replace = chr(39);

	$comma = chr(44);
	$period = chr(46);
	$question = chr(33);
	$exclamation = chr(63);
	$colon = chr(58);

	$xmlDoc = new DOMDocument();

	for($i = 0; $i < 5; $i++) {
		$xml = simplexml_load_file("http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.xml?&offset=" . $i*20 . "&api-key=" . $apiKey);
		foreach ($xml->results->result as $results){

			$title = $results->title;
			$views = $results->views;
/*
			$url = $results->url;
			$abstract = $results->abstract;
			$date = $results->published_date;

*/
			$title = str_replace($quote,$replace,$title);
			$article["title"][] = strtolower($title);
			$article["views"][] = $views;
/*
			$article["url"][] = $url;
			$article["abstract"][] = str_replace($quote,$replace,$abstract);
			$article["date"][] = $date;
*/
		}
	}

	$wordCounter = 0;
	for($i = 0; $i < 100; $i++) {

		$w = explode(" ", $article["title"][$i]);

		for($j = 0; $j < count($w); $j++){

			$w[$j] = trim($w[$j]);
			$w[$j] = str_replace( $comma, '',$w[$j]);
			$w[$j] = str_replace( $question, '',$w[$j]);
			$w[$j] = str_replace( $exclamation, '',$w[$j]);

			$word["word"][] = $w[$j];
			$word["views"][] += $article["views"][$i];

			if(isset($w[$j - 1])){
				$word["before"][$wordCounter] = $w[$j - 1];
			} else {
				$word["before"][$wordCounter] = "";
			}

			if($j + 1 < count($w)){
				$temp = $w[$j + 1];

				$temp = trim($temp);
				$temp = str_replace( $comma, '',$temp);
				$temp = str_replace( $question, '',$temp);
				$temp = str_replace( $exclamation, '',$temp);

				$word["after"][$wordCounter] = $temp;
			} else {
				$word["after"][$wordCounter] = "";
			}

			$wordCounter++;
		}

	}

	$numOccur = array_count_values($word["word"]);
	$keys = array_keys($numOccur);
	$views = array();

	for($i = 0; $i < count($keys); $i++){
		$views[$i] = 0;
		for($j = 0; $j < count($word["word"]); $j++){
			if($keys[$i] == $word["word"][$j]){
				$views[$i] += $word["views"][$j];
			}
		}
	}


	$xml_output = "<?xml version=\"1.0\"?>\n";
	$xml_output .= "<results>\n";

	$index = 0;
	foreach($numOccur as $times) {
		$xml_output .= "\t<result>\n";

		$xml_output .= "\t\t<word>" . $keys[$index] . "</word>\n";
		$xml_output .= "\t\t<num_occur>" . $times . "</num_occur>\n";
		$xml_output .= "\t\t<views>" . $views[$index] . "</views>\n";

		for($i = 0; $i < count($word["word"]); $i++){
			if($keys[$index] == $word["word"][$i]){
				if(isset($word["before"][$i])){
					$xml_output .= "\t\t<before>" . $word["before"][$i] . "</before>\n";
				}
				if(isset($word["after"][$i])){
					$xml_output .= "\t\t<after>" . $word["after"][$i] . "</after>\n";
				}
			}
		}

		$xml_output .= "\t</result>\n";

		$index++;
	}
/*
	for($i = 0; $i < 100; $i++) {
		$xml_output .= "\t<result key='details'>\n";

		$xml_output .= "\t\t<title>" . $article["title"][$i] . "</title>\n";
		$xml_output .= "\t\t<url>" . $article["url"][$i] . "</url>\n";
		$xml_output .= "\t\t<abstract>" . $article["abstract"][$i] . "</abstract>\n";
		$xml_output .= "\t\t<date>" . $article["date"][$i] . "</date>\n";
		$xml_output .= "\t\t<views>" . $article["views"][$i] . "</views>\n";

		$xml_output .= "\t</result>\n";
	}
*/

	$xml_output .= "</results>";

	$xmlDoc->loadXML($xml_output);
	echo $xmlDoc->saveXML();


?>