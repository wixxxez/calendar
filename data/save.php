<?php


//$data = file_get_contents('php://input');
//$data = json_encode(file_get_contents('php://input'), true);
//print_r($data);
//print_r($data);
$json = json_encode($_POST);

print_r($json);

//
//$current = file_get_contents( 'events.json' );
//
//$current = str_replace(']',",", $current);
//$current .=$data . "\n]";
//print_r($current);
//
//file_put_contents( 'events.json', $current );
//
//
//file_put_contents('events.json', print_r($current, true));
//
//
