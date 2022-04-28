<?php
$jsdir = scandir("./static/js");
foreach($jsdir as $str){
	if(substr($str,0,5) === 'main.')
		if(substr($str,strrpos($str,'.'),3) === '.js')
			$mainjs = $str;
}
$cssdir = scandir("./static/css");
foreach($cssdir as $str){
	if(substr($str,0,5) === 'main.')
		if(substr($str,strrpos($str,'.'),4) === '.css')
			$maincss = $str;
}

if(isset($_REQUEST["page"]) && $_REQUEST["page"] === "details"){
    if(isset($_REQUEST['itemType']) &&($_REQUEST['itemType'] === 'movie' || $_REQUEST['itemType'] === 'tv' || $_REQUEST['itemType'] === 'episode')){
        if(isset($_REQUEST['itemID'])){
            if(isset($_REQUEST['episode']) ){
              $url = 'https://api.videopulse.tv/api/metatags?itemType=episode&itemID='.$_REQUEST['itemID'].'&season='.$_REQUEST['season'].'&episode='.$_REQUEST['episode'].'&series='.urldecode($_REQUEST['series']); 
              // error_log(__FILE__." ".__LINE__." "."index.php ".$url);
            }
            else{
              $url = 'https://api.videopulse.tv/api/metatags?itemType='.$_REQUEST['itemType'].'&itemID='.$_REQUEST['itemID'];
            }
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, false);
            $results = curl_exec($ch);
            $arr = json_decode($results);
        }
    }
}
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
$full_url = $protocol."://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
for($i = 0; $i < count($arr); $i++){
  $tags .= $arr[$i] . "\n";
}

echo '<!DOCTYPE html> 
<html lang="en"> 
  <head> 
    <meta charset="utf-8" />
    <link rel="icon" href="./favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="VideoPulse movie and TV guide" />
    <meta property="og:url" content="' . $full_url . '" />
    '. 
    $tags . 
    '<link rel="apple-touch-icon" href="./logo192.png" />
    <link rel="manifest" href="./manifest.json" />
    <title>VideoPulse</title>
    <script defer="defer" src="./static/js/' . $mainjs . '"></script>
    <link href="./static/css/' . $maincss . '" rel="stylesheet" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>

    <div id="root"></div>
  </body>
</html>';
