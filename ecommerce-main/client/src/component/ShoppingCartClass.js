export class ShoppingCart {
  constructor() {}

  /**
   * Revnoie le contenu du panier
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @return JSON Objet contenu le contenu de la commande
   **/
  static getContent() {
    return JSON.parse(localStorage.getItem("shoppingCart"));
  }

  /**
   * Change le contenu du panier
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @params value Nouvelle velur du panier
   *
   **/
  static setContent(value) {
    localStorage.setItem("shoppingCart", JSON.stringify(value));
  }

  /**
   * TO DO
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   **/
  static countItems() {}

  /**
   * Change la quantité d'un objet
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @params id ID de l'objet a changer
   * @params newQuantity Nouvelle quantité pour l'objet
   *
   **/
  static changeItemQuantity(id, newQuantity) {
    var content = this.getContent();

    content.forEach((article, key) => {
      console.log(article);
      if (article.itemId == id) {
        article.quantity = newQuantity;
      }
    });

    this.setContent(content);
  }

  /**
   * Ajoute un article au panier
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @params id ID de l'objet
   * @params quantity Quantité a ajouter
   *
   **/
  static addItemToCart(id, quantity, format) {
    console.log(format)
    var content = this.getContent();

    if (content == null) {
      content = [];
    }

    content.push({
      itemId: id,
      quantity: quantity,
      format:format
    });
    console.log(content);

    this.setContent(content);
    console.log(this.getContent());
  }

  /**
   * supprime l'objet
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @params id ID de l'objet a ajouter
   *
   **/
  static async removeItem(id) {
    var content = this.getContent();

    content.forEach((article, key) => {
      console.log(article);
      if (article.itemId == id) {
        content.splice(key, 1);
      }
    });

    this.setContent(content);
  }
}

export default ShoppingCart;
