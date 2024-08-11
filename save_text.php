<?php
$servername = "localhost";
$username = "root"; // 
$password = ""; // 
$dbname = "Converter";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$text = $_POST['text'];


$sql = "INSERT INTO SpeakerText (Text) VALUES ('$text')";

if ($conn->query($sql) === TRUE) {
    echo "Record saved successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
