import React, { useState } from 'react';
import { UNIPESA_CONFIG } from '../unipesaConfig';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('orangemoney'); // Default to Orange Money

  const handlePayment = async () => {
    if (!amount || !phone) {
      alert('Veuillez entrer un montant et un numéro de téléphone.');
      return;
    }

    // This is where you would make a call to your backend server.
    // The backend server would then make a secure call to the Unipesa API with the secret key.
    console.log('Initiating payment with the following details:');
    console.log('Amount:', amount);
    console.log('Phone:', phone);
    console.log('Payment Method:', paymentMethod);
    console.log('Public ID:', UNIPESA_CONFIG.PUBLIC_ID);
    console.log('Merchant ID:', UNIPESA_CONFIG.MERCHANT_ID);

    // Example of what the backend call might look like (do not implement this on the frontend):
    // const response = await fetch('/api/initiate-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     amount,
    //     phone,
    //     paymentMethod,
    //   }),
    // });
    // const data = await response.json();
    // if (data.success) {
    //   alert('Paiement initié avec succès !');
    // } else {
    //   alert('Erreur lors de l'initiation du paiement.');
    // }
  };

  return (
    <div className="payment-container">
      <h2>Effectuer un paiement</h2>
      <div className="input-group">
        <label htmlFor="amount">Montant (CDF)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Entrez le montant"
        />
      </div>
      <div className="input-group">
        <label htmlFor="phone">Numéro de téléphone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Entrez votre numéro de téléphone"
        />
      </div>
      <div className="input-group">
        <label htmlFor="payment-method">Méthode de paiement</label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="orangemoney">Orange Money</option>
          <option value="airtelmoney">Airtel Money</option>
          <option value="africellmoney">Africell Money</option>
        </select>
      </div>
      <button onClick={handlePayment}>Payer</button>
    </div>
  );
};

export default Payment;