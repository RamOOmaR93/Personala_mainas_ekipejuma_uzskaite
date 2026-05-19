import { useEffect, useState } from "react";
import Calendar from "react-calendar";// Import React Calendar component and its default styles
import "react-calendar/dist/Calendar.css";

function HomePage({ user, onStartShift, onOpenShift, onLogout }) {
    const [shifts, setShifts] = useState([]);
    const [date, setDate] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState(null); //Kad lietotājs izvēlas datumu, šeit tiks saglabāta atbilstošā maiņa
    const [selectedShiftSummary, setSelectedShiftSummary] = useState([]);



    const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };



  useEffect(() => {
    fetch(`http://localhost:8080/shifts/user/${user.id}`, {
      credentials: "include"
    })
        .then((res) => res.json())
        .then((data) => {
            const sorted = data.sort((a, b) =>
                new Date(b.startTime) - new Date(a.startTime)
            );
            setShifts(sorted);
        })
        .catch((err) => console.error(err));
    }, []);

    const today = formatLocalDate(new Date()); //ņem datumu pēc esošās laika zonas, lai salīdzināšana būtu korekta

    const activeShift = shifts.find(shift =>
      shift.startTime.split("T")[0] === today
    );


    const hasTodayShift = shifts.some(shift =>
      shift.startTime.split("T")[0] === today
    );


    const shiftDates = shifts.map(shift =>
      shift.startTime.split("T")[0]
    );

    

   
  






  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Sākumlapa</h2>
          <p className="page-subtitle">Sveiks, {user.username}</p>
        </div>

        <button className="btn btn-secondary" onClick={onLogout}>
          Izlogoties
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card active-shift-card">
          <h3>Aktīvā maiņa</h3>

          {hasTodayShift && (
            <p className="message message-warning">
              Šodienas maiņa jau ir uzsākta.
            </p>
          )}

          {activeShift ? (
            <p>
              Maiņa ID: {activeShift.id} | Sākums: {activeShift.startTime}
            </p>
          ) : (
            <p className="text-muted">Aktīva maiņa nav atrasta.</p>
          )}

          <button
            className="btn start-shift-button"
            onClick={onStartShift}
            disabled={hasTodayShift}
          >
            Sākt maiņu
          </button>
        </div>

        <div className="card">
          <h3>Manas maiņas</h3>

          <Calendar
            onChange={(selectedDate) => {
              setDate(selectedDate);

              const formattedDate = formatLocalDate(selectedDate);
              const foundShift = shifts.find((shift) =>
                shift.startTime.split("T")[0] === formattedDate
              );

              setSelectedShift(foundShift || null);

              if (foundShift) {
                fetch(`http://localhost:8080/shift-results/shift/${foundShift.id}/summary`, {
                  credentials: "include"
                })
                  .then((res) => res.json())
                  .then((data) => setSelectedShiftSummary(data))
                  .catch((err) => console.error(err));
              } else {
                setSelectedShiftSummary([]);
              }
            }}
            value={date}
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;

              const formattedDate = formatLocalDate(date);

              if (formattedDate === today && shiftDates.includes(formattedDate)) {
                return "active-shift-day";
              }

              if (shiftDates.includes(formattedDate)) {
                return "past-shift-day";
              }

              return null;
            }}
          />

          {selectedShift && (
            <div className="selected-shift-panel">
              <h3>Izvēlētā maiņa</h3>

              <p>Maiņas ID: {selectedShift.id}</p>
              <p>Sākums: {selectedShift.startTime}</p>

              <h4>Maiņas kopsavilkums</h4>

              {selectedShiftSummary.length === 0 ? (
                <p className="text-muted">Kopsavilkums nav pieejams.</p>
              ) : (
                <div className="summary-list">
                  {selectedShiftSummary.map((item, index) => (
                    <div className="summary-row" key={index}>
                      <span>{item.category}</span>
                      <strong> | Kopā: {item.totalAmount}</strong>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn" onClick={() => onOpenShift(selectedShift)}>
                Atvērt maiņu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;