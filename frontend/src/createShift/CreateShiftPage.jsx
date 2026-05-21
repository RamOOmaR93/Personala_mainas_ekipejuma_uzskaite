import { useState } from "react";

function CreateShiftPage({ user, onShiftCreated, onBack }) {
  const [shiftDate, setShiftDate] = useState("");
  const [comment, setComment] = useState("");

  // Allow shift creation only for today or yesterday
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Set minimum and maximum selectable dates for shift creation
  const minDate = formatDate(yesterday);
  const maxDate = formatDate(today);


  //USER
  //Take the logged-in user's ID and include it in the request
  const handleCreateShift = async () => {
    const shiftData = {
      userId: user.id,
      shiftDate: shiftDate,
      comment: comment
    };

    try {
      const response = await fetch("http://localhost:8080/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(shiftData)
      });

      if (!response.ok) {
        throw new Error("Neizdevās izveidot maiņu");
      }

      const data = await response.json();
      onShiftCreated(data);

      console.log("Shift ID:", data.id);
      console.log("Izveidotā maiņa:", data);
      alert("Maiņa veiksmīgi izveidota");
    } catch (error) {
      console.error(error);
      alert("Kļūda, veidojot maiņu");
    }
  };

  return (
    <div className="page-container">
      <div className="form-page-card card">
        <h2 className="page-title">Izveidot maiņu</h2>

        {/* Shift Date Selection */}

        <div className="form-group">
          <label>Datums:</label>

          <input
            className="form-input"
            type="date"
            value={shiftDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setShiftDate(e.target.value)}
          />
        </div>

        {/* Shift Comment Input */}

        <div className="form-group">
          <label>Komentārs:</label>

          <input
            className="form-input"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn" onClick={handleCreateShift}>
            Izveidot maiņu
          </button>

          <button className="btn btn-secondary" onClick={onBack}>
            Atpakaļ
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateShiftPage;