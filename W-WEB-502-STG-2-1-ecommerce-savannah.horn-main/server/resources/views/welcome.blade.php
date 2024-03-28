<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="http://127.0.0.1:8000/api/addArticle/" method="POST" enctype="multipart/form-data">
        <input type="text" name="description" placeholder="description">
        <input type="text" name="caracteristique" placeholder="caracteristique">
        <input type="text" name="prix" placeholder="prix">
        <input type="text" name="poids" placeholder="poids">
        <input type="text" name="couleur" placeholder="couleur">
        <input type="text" name="collection" id="" placeholder="collection">
        <input type="text" name="stock" id="" placeholder="stock">
        <input type="file" name="photos[]" multiple>
        <button type="submit"></button>
    </form>
</body>
</html>