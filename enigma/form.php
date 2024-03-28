<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enigma</title>
</head>

<body>
    <div class="container">
        <h1>César</h1>

        <form method="post" action="enigma.php">
            <label for="message">Message :</label>
            <br><textarea name="message" id="message" rows="4" cols="50"></textarea><br>
            <label for="key">Clé (entre 1 et 26) :</label>
            <input type="number" name="key" id="key" min="1" max="26" required><br>

            <label for="action">Action :</label>
            <select name="action" id="action" required>
                <option value="encrypt">Crypter</option>
                <option value="decrypt">Décrypter</option>
            </select><br>

            <input type="submit" value="Valider">
        </form>


        <h1>Vigenière</h1>
        <form method="post" action="enigma.php">
            <label for="message">Message :</label>
            <br><textarea name="message" id="message" rows="4" cols="50"></textarea><br>

            <label for="key">Clé :</label>
            <input type="text" name="key" id="key" required pattern="[A-Za-z]+" title="Veuillez entrer une clé alphabétique"><br>


            <label for="action">Action :</label>
            <select name="action" id="action" required>
                <option value="vigenere">Vigenère</option>
            </select><br>

            <input type="submit" value="Valider">
        </form>
    </div>
</body>

</html>