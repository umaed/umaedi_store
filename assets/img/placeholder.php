<?php
// Generate placeholder image
$width = isset($_GET['w']) ? intval($_GET['w']) : 200;
$height = isset($_GET['h']) ? intval($_GET['h']) : 200;
$bgColor = isset($_GET['bg']) ? htmlspecialchars($_GET['bg']) : 'f5f5f5';
$textColor = isset($_GET['txt']) ? htmlspecialchars($_GET['txt']) : 'bfa14a';
$text = isset($_GET['text']) ? htmlspecialchars($_GET['text']) : 'UMAEDI';

$image = imagecreate($width, $height);
$bgHex = sscanf($bgColor, "%2x%2x%2x");
$bgRGB = imagecolorallocate($image, $bgHex[0], $bgHex[1], $bgHex[2]);

$txtHex = sscanf($textColor, "%2x%2x%2x");
$txtRGB = imagecolorallocate($image, $txtHex[0], $txtHex[1], $txtHex[2]);

imagefilledrectangle($image, 0, 0, $width, $height, $bgRGB);

$fontSize = 3;
$textBox = imagettfbbox($fontSize, 0, __DIR__ . '/arial.ttf', $text);
$textWidth = $textBox[2] - $textBox[0];
$textHeight = $textBox[1] - $textBox[7];
$x = ($width - $textWidth) / 2;
$y = ($height - $textHeight) / 2 + $textHeight;

imagestring($image, $fontSize, $x, $y, $text, $txtRGB);

header('Content-Type: image/png');
imagepng($image);
imagedestroy($image);
?>