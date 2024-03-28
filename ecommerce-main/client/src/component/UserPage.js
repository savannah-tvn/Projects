import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserPage.css";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";

function UserPage() {
  const [orders, setOrders] = useState();

  const [addCard, setaddCard] = useState(false)
  const [addAdress, setaddAdress] = useState(false)

  const [card_user, set_card_user] = useState([])
  const [adress_user, set_adress_user] = useState([])

  const [is_update_card, set_is_update_card] = useState(false)
  const [is_update_adress, set_is_update_adress] = useState(false)

  const [the_card, set_the_card] = useState([])
  const [the_adress, set_the_adress] = useState([])

  const [gestion_card, set_gestion_card] = useState(false)
  const [gestion_address, set_gestion_address] = useState(false)
  const ip = process.env.REACT_APP_IP


  function get_order() {
    axios
      .get(ip+"/api/userOrders", {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        setOrders(res.data);
      });
  }
  function get_card_user() {
    axios
      .get(ip+"/api/get_card_user", {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        set_card_user(res.data)
      });
  }
  function get_adress_user() {
    axios
      .get(ip+"/api/get_adress_user", {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        set_adress_user(res.data)
      });
  }
  function active_gestion_adress() {
    set_gestion_address(true)
    set_gestion_card(false)
  }
  function active_gestion_card() {
    set_gestion_card(true)
    set_gestion_address(false)
  }
  function back_to_main() {
    set_gestion_address(false)
    set_gestion_card(false)
  }
  useEffect(() => {
    get_order();
    get_card_user();
    get_adress_user();
  }, []);
  function add_card() {
    if (addCard) {
      setaddCard(false)
    }
    else {
      setaddCard(true)
    }
  }
  function add_adress() {
    if (addAdress) {
      setaddAdress(false)
    }
    else {
      setaddAdress(true)
    }
  }
  function register_card() {
    const Owner = document.querySelector('#Owner').value
    const Number = document.querySelector('#Numbercard').value
    const Date = document.querySelector('#Date').value

    if(Owner, Number, Date) {
      axios.post(ip+"/api/add_new_card",
      {Owner,Number,Date},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if(res.status ==200) {
          setaddCard(false)
        }
      });
    }

  }
  function register_adress() {
    const country = document.querySelector('#country').value
    const city = document.querySelector('#city').value
    const zipcode = document.querySelector('#zipcode').value
    const phone = document.querySelector('#phone').value
    const adress = document.querySelector('#address').value
    const last_name = document.querySelector('#last_name').value
    const first_name = document.querySelector('#first_name').value

    if(country, city, zipcode, phone, adress, last_name, first_name) {
      axios.post(ip+"/api/add_new_adress",
      {country, city, zipcode, phone, adress, last_name, first_name},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if(res.status ==200) {
          setaddAdress(false)
          get_adress_user()
        }
      });
    }




  }
  function delete_card(event) {
    const card_id = event.target.id
    axios.post(ip+"/api/delete_card",
      {card_id:card_id},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status == 200) {
          get_card_user()
        }
      });
  }
  function delete_adress(event) {
    const adress_id = event.target.id
    axios.post(ip+"/api/delete_adress",
      {adress_id:adress_id},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status == 200) {
          get_adress_user()
        }
      });
  }
  function get_the_card(card_id) {
    axios
      .get(ip+"/api/get_the_card/"+card_id, {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        set_the_card(res.data.data);
      });
  }
  function get_the_address(adress_id) {
    axios
      .get(ip+"/api/get_the_address/"+adress_id, {
        headers: {
          Authorization: "Bearer " + localStorage["token"],
        },
      })
      .then((res) => {
        set_the_adress(res.data.data);
      });
  }
  function update_card(event) {
    if (is_update_card) {
      set_is_update_card(false)
      set_the_card([])
    }
    else {
      const card_id = event.target.id
      set_is_update_card(true);
      get_the_card(card_id)
    }

  }
  function update_adress(event) {
    if (is_update_adress) {
      set_is_update_adress(false)
      set_the_adress([])
    }
    else {
      const adress_id = event.target.id
      set_is_update_adress(true)
      get_the_address(adress_id)
    }
  }
  function update_the_address(event) {

    const country = document.querySelector('#country').value
    const city = document.querySelector('#city').value
    const zipcode = document.querySelector('#zipcode').value
    const phone = document.querySelector('#phone').value
    const adress = document.querySelector('#address').value
    const last_name = document.querySelector('#last_name').value
    const first_name = document.querySelector('#first_name').value

    const address_id = event.target.id

    const data = {};

    if (country) {
      data['country'] = country;
    }
    else {
      data['country'] = ''
    }

    if (city) {
      data['city'] = city;
    }
    else {
      data['city'] = ''
    }

    if (zipcode) {
      data['zipcode'] = zipcode;
    }
    else {
      data['zipcode'] = ''
    }
    if (phone) {
      data['phone'] = phone;
  }
  else {
    data['phone'] = ''
  }
  if (adress) {
    data['address'] = adress;
}
else {
  data['address'] = ''
}
if (last_name) {
  data['last_name'] = last_name;
}
else {
data['last_name'] = ''
}
if (first_name) {
  data['first_name'] = first_name;
}
else {
data['first_name'] = ''
}
    axios.post(ip+"/api/update_the_address/"+address_id,
      {data},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status == 200) {
          set_is_update_adress(false)
          get_adress_user()
        }
      });

  }
  function update_the_card(event) {

    const owner = document.querySelector('#Owner').value
    const number = document.querySelector('#Numbercard').value
    const date = document.querySelector('#Date').value
    const card_id = event.target.id
    const data = {};

    if (owner) {
      data['owner'] = owner;
    }
    else {
      data['owner'] = ''
    }

    if (number) {
      data['number'] = number;
    }
    else {
      data['number'] = ''
    }

    if (date) {
      data['date'] = date;
    }
    else {
      data['date'] = ''
    }
    axios.post(ip+"/api/update_the_card/"+card_id,
      {data},
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              })
      .then((res) => {
        if (res.status == 200) {
          set_is_update_card(false)
          get_card_user()
        }
      });

  }

  if (addAdress) {
    return (
      <>

        <button className="btn btn-info" onClick={add_adress}>
          Back to profile
        </button>
        <div className="container-fluid">
          <form>
            <div class="form-group">
              <label for="country">Country</label>
              <input type="text" class="form-control" id="country" placeholder="country" />
            </div>
            <div class="form-group">
              <label for="city">city</label>
              <input type="text" class="form-control" id="city" placeholder="city" />
            </div>
            <div class="form-group">
              <label for="zipcode">zipcode</label>
              <input type="text" class="form-control" id="zipcode" placeholder="zipcode" />
            </div>
            <div class="form-group">
              <label for="phone">phone</label>
              <input type="text" class="form-control" id="phone" placeholder="phone" />
            </div>
            <div class="form-group">
              <label for="address">address</label>
              <input type="text" class="form-control" id="address" placeholder="address" />
            </div>
            <div class="form-group">
              <label for="last_name">last_name</label>
              <input type="text" class="form-control" id="last_name" placeholder="last_name" />
            </div>
            <div class="form-group">
              <label for="first_name">first_name</label>
              <input type="text" class="form-control" id="first_name" placeholder="first_name" />
            </div>
            <button type="button" onClick={register_adress} class="btn btn-primary">Add new adress</button>
          </form>
        </div>
      </>
    )
  }
  if (is_update_card) {
    return (
      <>
        <button className="btn btn-dark" onClick={update_card}>
          Back to profile
        </button>
        {the_card ? (
          <div className="container-fluid">
            <form>
              <div className="form-group">
                <label htmlFor="Owner">Owner</label>
                <input type="text" className="form-control" id="Owner" placeholder={the_card.owner} />
              </div>
              <div className="form-group">
                <label htmlFor="Numbercard">Number card</label>
                <input type="text" className="form-control" id="Numbercard" placeholder={the_card.number} />
              </div>
              <div className="form-group">
                <label htmlFor="Date">Date</label>
                <input type="text" className="form-control" id="Date" placeholder={the_card.date} />
              </div>
              <button id={the_card.id} type="button" onClick={update_the_card} className="btn btn-primary">
                Update card
              </button>
            </form>
          </div>
        ) : null}
      </>
    );
  }
  if (is_update_adress) {
    return (
      <>

        <button className="btn btn-dark" onClick={update_adress}>
          Back to profile
          <div className="header">
            <img src="/Assets/user.png" style={{ width: 90, marginLeft: 15 }}></img>
            <p>User Profile</p>
          </div>
        </button>
        {the_adress ? (
          <div className="container-fluid">
            <form>
              <div className="form-group">
                <label htmlFor="address">address</label>
                <input type="text" className="form-control" id="address" placeholder={the_adress.address} />
              </div>
              <div className="form-group">
                <label htmlFor="city">city</label>
                <input type="text" className="form-control" id="city" placeholder={the_adress.city} />
              </div>
              <div className="form-group">
                <label htmlFor="country">country</label>
                <input type="text" className="form-control" id="country" placeholder={the_adress.country} />
              </div>
              <div className="form-group">
                <label htmlFor="zipcode">zipcode</label>
                <input type="text" className="form-control" id="zipcode" placeholder={the_adress.zipcode} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">phone</label>
                <input type="text" className="form-control" id="phone" placeholder={the_adress.phone} />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">last_name</label>
                <input type="text" className="form-control" id="last_name" placeholder={the_adress.last_name} />
              </div>
              <div className="form-group">
                <label htmlFor="first_name">first_name</label>
                <input type="text" className="form-control" id="first_name" placeholder={the_adress.first_name} />
              </div>


              <button id={the_adress.id} type="button" onClick={update_the_address} className="btn btn-primary">
                Update address
              </button>
            </form>
          </div>
        ) : null}
      </>
    );
  }
  if (addCard) {
    return (
      <div>
        <Navbar />
        <button className="btn btn-dark" onClick={add_card}>Back to profile</button>
        <div className="container-fluid">
          <form>
            <div class="form-group">
              <label for="Owner">Owner</label>
              <input type="text" class="form-control" id="Owner" placeholder="Owner" />
            </div>
            <div class="form-group">
              <label for="Number card">Number card</label>
              <input type="text" class="form-control" id="Numbercard" placeholder="XXXX XXXX XXXX XXXX" />
            </div>
            <div class="form-group">
              <label for="Date">Date</label>
              <input type="text" class="form-control" id="Date" placeholder="01/23" />
            </div>
            <button type="button" onClick={register_card} class="btn btn-primary">Add new card</button>
          </form>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Navbar />
      {gestion_address ?
        <div>
          <div style={{ margin: 15 }}>
            <button className="btn btn-dark" onClick={add_adress}>Ajouter une adresse</button>
          </div>
          <div style={{ margin: 15 }}>
            <button className="btn btn-dark" onClick={back_to_main}>Revenir sur le profil</button>
          </div>
        </div>
        :
        <div>
          {/*POUR L'AFFICAGE DU LOGO ET DU HEADER USER PROFILE*/}
          <div className="header" style={{ display: 'flex' }}>
            <img src="/Assets/user.png" style={{ width: 120, marginLeft: 25, marginTop: 15 }}></img>
            <p style={{ paddingTop: 35, paddingLeft: 10, fontSize: 48 }}>User Profile</p>
          </div>
          <div className="card-lg" style={{ textAlign: 'center', marginLeft: 150, marginRight: 150, padding: 50 }}>
            <div className="card-header-sm">
              Gestion d'adresse
            </div>
            <div className="card-body-sm">
              <img src="/Assets/maps-and-flags.png" style={{ width: 24 }}></img>
              <h5>Modifier votre adresse de livraison</h5>
              <button className="btn btn-dark" onClick={active_gestion_adress}><b>GÉRER MES ADRESSES DE LIVRAISONS</b></button>
            </div>
          </div>
        </div>
      }
      {gestion_card ?
        <div>
          <div style={{ margin: 15 }}>
          </div>
          <div style={{ margin: 15, textAlign: 'center' }}>
            <button className="btn btn-dark" onClick={back_to_main}>Revenir sur le profil</button>
          </div>
        </div>
        :
        <div className="card-lg" style={{ textAlign: 'center', margin: 150, padding: 50 }}>
          <div className="card-header-sm">
            Gestion des cartes de paiement
          </div>
          <div className="card-body-sm">
          <img src="/Assets/credit-card.png" style={{ width: 24 }}></img>
            <h5>Modifier votre mode de paiement</h5>
            <button className="btn btn-dark" onClick={active_gestion_card }><b>GÉRER MES CARTES</b></button>
          </div>
        </div>
      }
      {card_user.length > 0 && gestion_card ? (
        <div className="container-fluid">
          <div style={{ display: 'flex', justifyContent: 'space-around' }} className="row">
            {card_user.map((element, index) => (
              <div className="col-4" key={index} id={element.id} style={{ marginBottom: 150 }}>
                <ul className="list-group list-group-flush card-lg">
                  <li className="list-group-item"><b>OWNER:</b> {element.owner}</li>
                  <li className="list-group-item"><b>CARD NUMBER:</b> {element.number}</li>
                  <li className="list-group-item"><b>EXPIRATION DATE:</b> {element.date}</li>
                  <div>
                    <button id={element.id} onClick={delete_card} className="btn btn-danger" style={{ margin: 10 }}>Supprimer cette carte</button>
                    <button id={element.id} onClick={update_card} className="btn btn-warning" style={{ margin: 10 }}>Modifier cette carte</button>
                    <button className="btn btn-dark" onClick={add_card} style={{margin: 10}}>Ajouter une carte</button>
                  </div>
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {adress_user.length > 0 && gestion_address ? (
        <div className="container-fluid">
          <div style={{ display: 'flex', justifyContent: 'space-around' }} className="row">
            {adress_user.map((element, index) => (
              <div className="col-4" key={index} id={element.id} style={{ marginBottom: 150, textAlign: 'center' }}>
                <ul className="list-group list-group-flush card-lg">
                  <li className="list-group-item"><b>FIRSTNAME:</b> {element.first_name}</li>
                  <li className="list-group-item"><b>LASTNAME:</b> {element.last_name}</li>
                  <li className="list-group-item"><b>ADDRESS:</b> {element.address}</li>
                  <li className="list-group-item"><b>CITY:</b> {element.city}</li>
                  <li className="list-group-item"><b>COUNTRY:</b> {element.country}</li>
                  <li className="list-group-item"><b>ZIPCODE:</b> {element.zipcode}</li>
                  <li className="list-group-item"><b>PHONE:</b> {element.phone}</li>

                  <div>
                    <button id={element.id} onClick={delete_adress} className="btn btn-danger" style={{ margin: 5 }}>Supprimer cette adress</button>
                    <button id={element.id} onClick={update_adress} className="btn btn-warning" style={{ margin: 5 }}>Modifier cette adress</button>
                  </div>
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="row">
        <div className="col-2 noMargin"></div>
        <div className="col-8 noMargin">
          {orders && !gestion_address && !gestion_card &&
            orders.map((order) => (
              <div className="orderSummary" key={order.id}>
                {" "}
                <h3>
                  {new Date(order.created_at).toUTCString() +
                    " : " +
                    order.delivery_status}
                </h3>{" "}
                <p> Tracking number : {order.tracking_number}</p>
              </div>
            ))}
        </div>
        <div className="col-2 noMargin"></div>
      </div>
      < Footer />
    </div>
  );
}

export default UserPage;
