import { useEffect, useState } from "react";

function HomePage({ username, onStartShift, onOpenShift }) {
    const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/shifts/user/3")
        .then((res) => res.json())
        .then((data) => {
            const sorted = data.sort((a, b) =>
                new Date(b.startTime) - new Date(a.startTime)
            );
            setShifts(sorted);
        })
        .catch((err) => console.error(err));
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const activeShift = shifts.find(shift => 
        shift.startTime.startsWith(today)
    );


    const hasTodayShift = shifts.some(shift =>
        shift.startTime.startsWith(today)
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sākumlapa</h2>
      <p>Sveiks, {username}</p>

        <button onClick={onStartShift} disabled={hasTodayShift}>
            Sākt maiņu
        </button>

    {hasTodayShift && (
        <p style={{ color: "red" }}>
            Šodienas maiņa jau ir uzsākta.
        </p>
    )}

      <h3 style={{ marginTop: "20px" }}>Aktīvā maiņa</h3>
      {activeShift ? (
        <p>
          Maiņa ID: {activeShift.id} | Sākums: {activeShift.startTime}
        </p>
      ) : (
        <p>Aktīva maiņa nav atrasta.</p>
      )}

      <h3 style={{ marginTop: "20px" }}>Manas maiņas</h3>

      {shifts.length === 0 ? (
        <p>Maiņas nav atrastas.</p>
      ) : (
        <ul>
          {shifts.map((shift) => (
            <li key={shift.id}>
                <button
                    onClick={() => onOpenShift(shift)}
                    style={{
                        backgroundColor: shift.startTime.startsWith(today) ? "#28a745" : "",
                        color: shift.startTime.startsWith(today) ? "white" : "",
                        padding: "5px 10px",
                        border: "1px solid #ccc",
                        cursor: "pointer"
                    }}
                    >
                    Maiņa ID: {shift.id} | Sākums: {shift.startTime}
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;