import { useEffect, useState } from "react";

function AddResultPage({ shift, onBackToHome }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState([]);
  const [editingResultId, setEditingResultId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editEntryDate, setEditEntryDate] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/shift-results/shift/${shift.id}`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error(err));
  }, [shift.id]);

  useEffect(() => {
    fetch(`http://localhost:8080/shift-results/shift/${shift.id}/summary`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error(err));
  }, [shift.id]);


  // Get shift start date from selected shift
  const shiftStartDate = shift.startTime.split("T")[0];

  // Allow result entry until the next day after shift start
  const nextDateObject = new Date(shiftStartDate);
  nextDateObject.setDate(nextDateObject.getDate() + 1);

  const maxEntryDate = nextDateObject.toISOString().split("T")[0];



  const today = new Date().toISOString().split("T")[0];

  // Managers can edit any shift,
  // workers only during the allowed shift period
  const openedByManager = shift.openedByManager === true;


  // Results can be added only while the shift is active or if the manager has opened it for editing after shift end
  const isEditable =
    openedByManager ||
    (today >= shiftStartDate && today <= maxEntryDate);


  // Determine if the current shift is still editable based on the current date and shift start date
  const handleAddResult = async () => {
    if (!category) {
      alert("Lūdzu izvēlies rezultāta kategoriju.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Lūdzu ievadi korektu rezultāta daudzumu.");
      return;
    }

    if (!entryDate) {
      alert("Lūdzu izvēlies datumu, kurā rezultāts tika iegūts.");
      return;
    }

    //SHIFT
    // Prepare shift result data from form inputs before sending it to backend
    const resultData = {
      shiftId: shift.id, //Link this result to the currently selected shift
      category: category,
      amount: Number(amount),
      entryDate: entryDate
    };


    // Send the new shift result to backend for saving
    try {
      const response = await fetch("http://localhost:8080/shift-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(resultData)
      });

      if (!response.ok) {
        throw new Error("Neizdevās pievienot rezultātu");
      }

      const data = await response.json();
      console.log("Pievienotais rezultāts:", data);

      // Clear form inputs after successful submission
      setCategory("");
      setAmount("");
      setEntryDate("");

      setResults([...results, data]);

      alert("Rezultāts veiksmīgi pievienots");
    } catch (error) {
      console.error(error);
      alert("Kļūda, pievienojot rezultātu");
    }

  };


  // Handle result deletion with confirmation prompt
  const handleDeleteResult = async (resultId) => {

      const confirmed = window.confirm(
          "Vai tiešām vēlies dzēst šo rezultātu?"
      );

      if (!confirmed) {
          return;
      }

      try {

          const response = await fetch(
              `http://localhost:8080/shift-results/${resultId}`,
              {
                  method: "DELETE",
                  credentials: "include"
              }
          );

          if (!response.ok) {
              const errorText = await response.text();
              alert(errorText);
              return;
          }

          setResults(
              results.filter((result) => result.id !== resultId)
          );

          alert("Rezultāts veiksmīgi dzēsts");

      } catch (error) {
          console.error(error);
          alert("Kļūda, dzēšot rezultātu");
      }
  };


  const handleUpdateResult = async () => {

      try {

          const response = await fetch(
              `http://localhost:8080/shift-results/${editingResultId}`,
              {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  credentials: "include",
                  body: JSON.stringify({
                      category: editCategory,
                      amount: Number(editAmount),
                      entryDate: editEntryDate
                  })
              }
          );

          if (!response.ok) {
              const errorText = await response.text();
              alert(errorText);
              return;
          }

          const updatedResult = await response.json();

          setResults(
              results.map((result) =>
                  result.id === updatedResult.id
                      ? updatedResult
                      : result
              )
          );

          setEditingResultId(null);

          alert("Rezultāts veiksmīgi atjaunots");

      } catch (error) {
          console.error(error);
          alert("Kļūda, atjaunojot rezultātu");
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

                        {isEditable && editingResultId !== result.id && (
                          <>
                              <button
                                  style={{ marginLeft: "10px" }}
                                  onClick={() => {
                                      setEditingResultId(result.id);
                                      setEditCategory(result.category);
                                      setEditAmount(result.amount);
                                      setEditEntryDate(result.entryDate);
                                  }}
                              >
                                  Rediģēt
                              </button>

                              <button
                                style={{ marginLeft: "10px" }}
                                onClick={() => handleDeleteResult(result.id)}
                            >
                                Dzēst
                            </button>
                          </>


                        )}

                        {editingResultId === result.id && (
                            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <div>
                                    <label>Kategorija:</label>
                                    <br />
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                    >
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
                                        value={editAmount}
                                        onChange={(e) => setEditAmount(e.target.value)}
                                    />
                                </div>

                                <div style={{ marginTop: "10px" }}>
                                    <label>Datums:</label>
                                    <br />
                                    <input
                                        type="date"
                                        value={editEntryDate}
                                        min={shiftStartDate}
                                        max={maxEntryDate}
                                        onChange={(e) => setEditEntryDate(e.target.value)}
                                    />
                                </div>

                                <button
                                    style={{ marginTop: "10px" }}
                                    onClick={handleUpdateResult}
                                >
                                    Saglabāt
                                </button>

                                <button
                                    style={{ marginTop: "10px", marginLeft: "10px" }}
                                    onClick={() => setEditingResultId(null)}
                                >
                                    Atcelt
                                </button>
                            </div>
                        )}
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
          // Disable result form when the shift is no longer editable
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
          // Disable result form when the shift is no longer editable
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
          // Disable result form when the shift is no longer editable
          disabled={!isEditable}
          onChange={(e) => setEntryDate(e.target.value)}
        />
      </div>

        <button 
        style={{ marginTop: "10px" }} 
        onClick={handleAddResult}
        // Disable result form when the shift is no longer editable
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