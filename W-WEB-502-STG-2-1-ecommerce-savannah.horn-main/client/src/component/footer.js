import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './footer.css';

function Footer() {
    return (
<footer>
        <p>&copy; {new Date().getFullYear()} -
          All rights reserved..</p>
        <div className='footer-items'>
          <img src='/Assets/348.jpg' alt='/opt/lampp/htdocs/ecomerce/client/src/component/footer.jssocial Icons fotter' style={{ width: 120 }} />
        </div>
        <p><img src='/Assets/support.png'alt='icon support' style={{ width: 30 }} /> Help & Support</p>

      </footer>
    );
}
export default Footer;