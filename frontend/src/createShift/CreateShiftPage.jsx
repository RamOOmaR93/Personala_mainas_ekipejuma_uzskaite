import { useState } from "react";

function CreateShiftPage({ user, onShiftCreated }) {
  const [shiftDate, setShiftDate] = useState("");
  const [comment, setComment] = useState("");

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

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
    <div style={{ padding: "20px" }}>
      <h2>Izveidot maiņu</h2>

      <div>
        <label>Datums:</label>
        <br />
        <input
          type="date"
          value={shiftDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => setShiftDate(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Komentārs:</label>
        <br />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button style={{ marginTop: "10px" }} onClick={handleCreateShift}>
        Izveidot maiņu
      </button>
    </div>
  );
}

export default CreateShiftPage;