<?php

require_once 'form.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $message = $_POST['message'];
    $key = $_POST['key'];
    $action = $_POST['action'];

    if ($action == 'vigenere') {
        $result = vigenereCipher($message, $key, 'encrypt'); 
        echo '<br><h2">Message chiffré :</h2> ' . $result;

        $decryptedMessage = vigenereCipher($result, $key, 'decrypt');
        echo '<br><h2">Message déchiffré :</h2> ' . $decryptedMessage;
    } else {
        $result = cesarCipher($message, $key, $action); 
        echo '<br><h2">Résultat :</h2> ' . $result;
    }
}

function cesarCipher($message, $key, $action) {
    $result = '';
    $message = strtoupper($message);

    for ($i = 0; $i < strlen($message); $i++) {
        $char = $message[$i];

        if ($char >= 'A' && $char <= 'Z') {
            if ($action == 'encrypt') {
                $result .= chr(((ord($char) - 65 + $key) % 26) + 65);
            } elseif ($action == 'decrypt') {
                $result .= chr(((ord($char) - 65 - $key + 26) % 26) + 65);
            }
        } else {
            $result .= $char; 
        }
    }

    return $result;
}

function vigenereCipher($message, $key, $action) {
    $result = '';
    $message = strtoupper($message);
    $key = strtoupper($key);
    $keyLength = strlen($key);
    $keyIndex = 0;

    for ($i = 0; $i < strlen($message); $i++) {
        $char = $message[$i];

        if ($char >= 'A' && $char <= 'Z') {
            if ($action == 'encrypt') {
                $result .= chr(((ord($char) + ord($key[$keyIndex])) % 26) + 65);
            } elseif ($action == 'decrypt') {
                $result .= chr(((ord($char) - ord($key[$keyIndex]) + 26) % 26) + 65);
            }

            $keyIndex = ($keyIndex + 1) % $keyLength; 
        } else {
            $result .= $char; 
        }
    }

    return $result;
}


