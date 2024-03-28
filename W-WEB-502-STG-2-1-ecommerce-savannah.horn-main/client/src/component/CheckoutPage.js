import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CheckoutPage.css";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import ShoppingCart from "./ShoppingCartClass";
import ShoppingCartItem from "./ShoppingCartPageItem";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";
import axios from "axios";

function ShoppingCartPage() {
  const ip = process.env.REACT_APP_IP;

  const [shoppingCart, setshoppingCart] = useState(ShoppingCart.getContent());
  const [cardNumber, setCardNumber] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [rates, setRates] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [step, setStep] = useState("enteringAddress");
  const [addressList, setAddressList] = useState();
  const [cardList, setCardList] = useState();
  const [addressAutoCompleted, setAddressAutoCompleted] = useState(false);
  const [cardAutoCompleted, setCardAutoCompleted] = useState(false);
  const [cardType, setCardType] = useState(false);
  const [cannotProceed, setCannotProceed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [creditCardId, setCreditCardId] = useState(false);

  /**
   * desciption de la fonction
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @params address Objet Adresse contenant l'adresse a utiliser
   *
   **/
  const autoCompleteAddress = (address) => {
    setAddressAutoCompleted(true);
    setAddress(address.address);
    setFirstName(address.first_name);
    setLastName(address.last_name);
    setZipcode(address.zipcode);
    setCity(address.city);
    setCountry(address.country);
    setPhone(address.phone);

    setStep("enteringCard");
  };

  /**
   * Cherche le type de carte
   *
   * @author nom de l'auteur + mail
   * @version V1.1
   *
   * @params number Numéro de la carte
   *
   **/
  const searchCardType = (number) => {
    var re = {
      electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
      maestro:
        /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
      dankort: /^(5019)\d+$/,
      interpayment: /^(636)\d+$/,
      unionpay: /^(62|88)\d+$/,
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
    };

    for (var key in re) {
      if (re[key].test(number)) {
        setCardType(key);
        if (key == "amex" && country != "US") {
          console.log("cannot proceed");
          setCannotProceed(true);
          setErrorMessage("Cannot use American Express Outside of the US.");
        } else if (key == "dankort" && country != "DK") {
          setCannotProceed(true);
          setErrorMessage("Cannot use Dnakort outside of Denmark.");
        }

        return;
      }
    }

    setCannotProceed(false);
    setErrorMessage("");
    setCardType("");
  };

  /**
   * Cherche mes rates avec un call API
   *
   * @author nom de l'auteur + mail
   * @version V1.1
   **/
  const searchRates = () => {
    setStep("selectingRate");
    axios
      .post(ip + "/api/ship/rates", {
        firstName: firstName,
        lastName: lastName,
        address: address,
        country: country,
        zipcode: zipcode,
        city: city,
        phone: phone,
        cart: JSON.stringify(shoppingCart),
      })
      .then((res) => {
        console.log(res.data.rates);
        setRates(res.data.rates);
      })
      .catch(console.log);
  };

  /**
   * Passe la commande et la sauvegarde dans la base de données
   *
   * @author nom de l'auteur + mail
   * @version V1.1
   *
   * @params param1 desc param1 + type param1
   *
   **/
  const processOrder = (rate) => {
    if (localStorage["token"] != null) {
      axios
        .post(
          ip + "/api/order",
          {
            rate: JSON.stringify(rate),
            orderContent: localStorage.getItem("shoppingCart"),
            lastName: lastName,
            firstName: firstName,
            address: address,
            country: country,
            zipcode: zipcode,
            city: city,
            phone: phone,
            cardNumber: cardNumber,
            cardCode: cardCode,
            cardOwner: cardOwner,
            cardDate: cardDate,
            addressAutoCompleted: addressAutoCompleted,
            cardAutoCompleted: cardAutoCompleted,
            creditCardId: creditCardId,
          },
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.status == "SUCCESS") {
            setStep("orderSent");
            setOrdering(false);
            setTrackingNumber(res.data.tracking_number);
            axios
              .post(ip + "/api/message", {
                email: user.email,
                message:
                  "Your tracking number is : " + res.data.tracking_number,
              })
              .catch(console.log);
          } else {
            setOrdering(false);
            setErrorMessage(res.data.messages[0].text);
          }
        })
        .catch(console.log);
    } else {
      axios
        .post(ip + "/api/guestOrder", {
          rate: JSON.stringify(rate),
          orderContent: localStorage.getItem("shoppingCart"),
          firstName: firstName,
          lastName: lastName,
          address: address,
          country: country,
          zipcode: zipcode,
          city: city,
          phone: phone,
          cardNumber: cardNumber,
          cardCode: cardCode,
          cardOwner: cardOwner,
          cardDate: cardDate,
        })
        .then((res) => {
          if (res.data.status == "SUCCESS") {
            setStep("orderSent");
            setTrackingNumber(res.data.tracking_number);
            axios
              .post(ip + "/api/message", {
                email: email,
                message:
                  "Your tracking number is : " + res.data.tracking_number,
              })
              .catch(console.log);
          }
        })
        .catch(console.log);
    }
  };

  useEffect(() => {
    //Only get infos if user is connected
    if (localStorage["token"] == null) return;

    axios
      .get(ip + "/api/user", {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(console.log);

    axios
      .get(ip + "/api/userAddresses", {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        setAddressList(res.data);
      })
      .catch(console.log);

    axios
      .get(ip + "/api/userCards", {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        setCardList(res.data);
      })
      .catch(console.log);
  }, []);

  return (
    <div>
      <Navbar />
      {step == "enteringAddress" ? (
        <div className="row">
          <div className="col-2"></div>
          <div id="cardInfos" className="col-8 background">
            <div>
              <div className="row">
                {addressList
                  ? addressList.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => {
                          autoCompleteAddress(address);
                        }}
                        className="providerSelect mb-4"
                      >
                        {address.first_name +
                          " " +
                          address.last_name +
                          ", " +
                          address.address +
                          " " +
                          address.city}
                      </button>
                    ))
                  : ""}
                <input
                  className="col-6"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <input
                  className="col-6"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />{" "}
              </div>
            </div>
            {!user ? (
              <div className="row">
                <input
                  className="col-12"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />{" "}
              </div>
            ) : (
              ""
            )}
            <div className="row">
              <input
                className="col-12"
                placeholder="Address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />{" "}
            </div>
            <div className="row">
              <input
                className="col-6"
                placeholder="City"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />{" "}
              <input
                className="col-6"
                placeholder="Zipcode"
                value={zipcode}
                onChange={(e) => {
                  setZipcode(e.target.value);
                }}
              />{" "}
            </div>
            <div className="row">
              <input
                className="col-12"
                placeholder="Country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              />{" "}
            </div>
            <div className="row">
              <input
                className="col-12"
                placeholder="Phone (International Format)"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />{" "}
            </div>
            <button
              onClick={() => {
                setStep("enteringCard");
              }}
              className="btn btn-lg btn-dark my-2"
            >
              Next
            </button>
          </div>
          <div className="col-2"></div>
        </div>
      ) : (
        ""
      )}
      {step == "enteringCard" ? (
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 background">
            {cardList
              ? cardList.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCardDate("");
                      setCardOwner("");
                      setCardNumber("");
                      setCreditCardId(card.id);
                      searchRates();
                    }}
                    className="providerSelect mb-4"
                  >
                    {card.number + " - " + card.owner}
                  </button>
                ))
              : ""}
            <h4>Enter your credit card information :</h4>
            <div className="row">
              <input
                placeholder="XXXX XXXX XXXX XXXX"
                className="col-9"
                value={cardNumber}
                onChange={(e) => {
                  searchCardType(e.target.value);
                  setCardNumber(e.target.value);
                }}
              />
              <div className="col-2">{cardType}</div>
            </div>
            <div className="row">
              <input
                placeholder="John Doe"
                className="col-12"
                value={cardOwner}
                onChange={(e) => {
                  setCardOwner(e.target.value);
                }}
              />
            </div>
            <div className="row mb-3">
              <input
                placeholder="01/23"
                className="col-6"
                value={cardDate}
                onChange={(e) => {
                  setCardDate(e.target.value);
                }}
              />
              <input
                className="col-6"
                placeholder="XXX"
                value={cardCode}
                onChange={(e) => {
                  setCardCode(e.target.value);
                }}
              />
            </div>
            <button
              disabled={cannotProceed}
              onClick={searchRates}
              className="btn btn-lg btn-dark my-2"
            >
              Search rates
            </button>
            <div>{errorMessage}</div>
          </div>
          <div className="col-2"></div>
        </div>
      ) : (
        ""
      )}
      {step == "selectingRate" && !ordering ? (
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 background">
            {errorMessage ? (
              <div className="alert alert-warning">{errorMessage}</div>
            ) : (
              ""
            )}
            <h3 class="my-3">Select a delivery provider :</h3>
            {rates ? (
              rates.map((rate) => (
                <div>
                  <button
                    onClick={() => {
                      processOrder(rate);
                      setOrdering(true);
                    }}
                    className="providerSelect"
                  >
                    {rate.provider + " - " + rate.servicelevel.name} :{" "}
                    {rate.amount_local + " " + rate.currency_local}
                  </button>
                  <br />
                </div>
              ))
            ) : (
              <p>Fetching rates ...!</p>
            )}
          </div>
          <div className="col-2"></div>
        </div>
      ) : (
        ""
      )}

      {ordering ? (
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 background">
            <h3 class="my-3">Processing Order...</h3>
          </div>
          <div className="col-2"></div>
        </div>
      ) : (
        ""
      )}

      {step == "orderSent" ? (
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 background">
            <h3 class="my-3">
              Order sent! Your tracking number is : {trackingNumber}
            </h3>
          </div>
          <div className="col-2"></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ShoppingCartPage;
