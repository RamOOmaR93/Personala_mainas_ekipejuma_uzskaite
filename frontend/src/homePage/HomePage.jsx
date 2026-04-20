import { useEffect, useState } from "react";
import Calendar from "react-calendar";
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
    <div style={{ padding: "20px" }}>
      <h2>Sākumlapa</h2>
      <p>Sveiks, {user.username}</p>
      <button onClick={onLogout}>Izlogoties</button>

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
        <div style={{ marginTop: "20px" }}>
          <h4>Izvēlētā maiņa</h4>
          <p>Maiņas ID: {selectedShift.id}</p>
          <p>Sākums: {selectedShift.startTime}</p>

          <h4 style={{ marginTop: "15px" }}>Maiņas kopsavilkums</h4>

          {selectedShiftSummary.length === 0 ? (
            <p>Kopsavilkums nav pieejams.</p>
          ) : (
            <ul>
              {selectedShiftSummary.map((item, index) => (
                <li key={index}>
                  {item.category} | kopā: {item.totalAmount}
                </li>
              ))}
            </ul>
          )}

          <button onClick={() => onOpenShift(selectedShift)}>
            Atvērt maiņu
          </button>
        </div>
      )}



      
    </div>
  );
}

export default HomePage;