import { useEffect, useState } from "react";

function AddResultPage({ shift, onBackToHome }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/shift-results/shift/${shift.id}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error(err));
  }, [shift.id]);

  useEffect(() => {
    fetch(`http://localhost:8080/shift-results/shift/${shift.id}/summary`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error(err));
  }, [shift.id]);


  const shiftStartDate = shift.startTime.split("T")[0];

  const nextDateObject = new Date(shiftStartDate);
  nextDateObject.setDate(nextDateObject.getDate() + 1);

  const maxEntryDate = nextDateObject.toISOString().split("T")[0];



  const today = new Date().toISOString().split("T")[0];

  const isEditable = today >= shiftStartDate && today <= maxEntryDate;


  const handleAddResult = async () => {
    const resultData = {
      shiftId: shift.id,
      category: category,
      amount: Number(amount),
      entryDate: entryDate
    };

    try {
      const response = await fetch("http://localhost:8080/shift-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resultData)
      });

      if (!response.ok) {
        throw new Error("Neizdevās pievienot rezultātu");
      }

      const data = await response.json();
      console.log("Pievienotais rezultāts:", data);
      alert("Rezultāts veiksmīgi pievienots");
    } catch (error) {
      console.error(error);
      alert("Kļūda, pievienojot rezultātu");
    }

    

    
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pievienot rezultātu</h2>
      <p>Maiņas ID: {shift.id}</p>

      <h3>Esošie rezultāti</h3>

      {results.length === 0 ? (
              <p>Rezultāti vēl nav pievienoti.</p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={result.id}>
                    {result.category} | {result.amount} | {result.entryDate}
                  </li>
                ))}
              </ul>
            )}

      <h3 style={{ marginTop: "20px" }}>Kopsavilkums</h3>

      {summary.length === 0 ? (
        <p>Kopsavilkums nav pieejams.</p>
      ) : (
        <ul>
          {summary.map((item, index) => (
            <li key={index}>
              {item.category} | kopā: {item.totalAmount}
            </li>
          ))}
        </ul>
      )}




      



      <div>
        <label>Kategorija:</label>
        <br />
        <select 
          value={category}
          disabled={!isEditable}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">-- Izvēlies kategoriju --</option>
          <option value="IESNIEGUMS">IESNIEGUMS</option>
          <option value="APSTASANAS_STAVESANAS_NOTEIKUMI">APSTASANAS_STAVESANAS_NOTEIKUMI</option>
          <option value="RISKU_IZVERTESANA">RISKU_IZVERTESANA</option>
          <option value="LEMUMS_PAR_NOSKIRSANU">LEMUMS_PAR_NOSKIRSANU</option>
          <option value="APAS_ALKOHOLA_LIETOSANA_ATRASANAS">APAS_ALKOHOLA_LIETOSANA_ATRASANAS</option>
          <option value="APAS_MIERA_TRAUCESANA">APAS_MIERA_TRAUCESANA</option>
          <option value="APAS_CELU_SATIKSMES_LIKUMS">APAS_CELU_SATIKSMES_LIKUMS</option>
          <option value="APAS_DZIVESVIETAS_DEKLARESANAS_LIKUMS">APAS_DZIVESVIETAS_DEKLARESANAS_LIKUMS</option>
          <option value="APAS_SMEKESANAS_NOTEIKUMU_NEIEVEROSANA">APAS_SMEKESANAS_NOTEIKUMU_NEIEVEROSANA</option>
          <option value="APAS_DZIVNIEKU_AIZSARDZIBAS_LIKUMS">APAS_DZIVNIEKU_AIZSARDZIBAS_LIKUMS</option>
          <option value="APAS_SAISTOSO_NOTEIKUMU_IEVEROSANA">APAS_SAISTOSO_NOTEIKUMU_IEVEROSANA</option>
          <option value="APAS_ATKRITUMU_APSAIMNIEKOSANAS_LIKUMS">APAS_ATKRITUMU_APSAIMNIEKOSANAS_LIKUMS</option>
          <option value="APAS_BERNU_TIESIBU_AIZSARDZIBAS_LIKUMS">APAS_BERNU_TIESIBU_AIZSARDZIBAS_LIKUMS</option>
          <option value="APAS_MAKSKERESANAS_NOTEIKUMU_IEVEROSANA">APAS_MAKSKERESANAS_NOTEIKUMU_IEVEROSANA</option>
          <option value="APAS_ATTEIKUMS_UZSAKT_PROCESU">APAS_ATTEIKUMS_UZSAKT_PROCESU</option>
          <option value="APAS_UZDEVUMS_CITAI_IESTADEI">APAS_UZDEVUMS_CITAI_IESTADEI</option>
          <option value="LICENCETAS_MAKSKERESANAS_PARBAUDE">LICENCETAS_MAKSKERESANAS_PARBAUDE</option>
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Daudzums:</label>
        <br />
        <input
          type="number"
          value={amount}
          disabled={!isEditable}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Datums:</label>
        <br />
        <input
          type="date"
          value={entryDate}
          min={shiftStartDate}
          max={maxEntryDate}
          disabled={!isEditable}
          onChange={(e) => setEntryDate(e.target.value)}
        />
      </div>

        <button 
        style={{ marginTop: "10px" }} 
        onClick={handleAddResult}
        disabled={!isEditable}
        >
            Pievienot rezultātu
        </button>
        <button 
          style={{ marginTop: "10px", marginLeft: "10px" }} 
          onClick={onBackToHome}>
            Atpakaļ uz sākumlapu
        </button>
    </div>
  );
}

export default AddResultPage;