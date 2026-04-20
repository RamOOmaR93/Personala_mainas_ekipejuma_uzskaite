import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function ManagerHomePage({ onLogout }) {
  const [date, setDate] = useState(new Date());
  const [summary, setSummary] = useState([]);
  const [dayShifts, setDayShifts] = useState([]);
  const [employeeSummaries, setEmployeeSummaries] = useState({});



  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };




  return (
    <div style={{ padding: "20px" }}>
      <h2>Sveiks Priekšniek</h2>
      <button onClick={onLogout}>Izlogoties</button>
      <p>ATSKAITĒM/PĀRSKATS</p>

      <h3 style={{ marginTop: "20px" }}>Izvēlies datumu</h3>

        <Calendar
            onChange={(selectedDate) => {
                setDate(selectedDate);

                const formattedDate = formatLocalDate(selectedDate);

                fetch(`http://localhost:8080/shift-results/summary/by-shift-date?date=${formattedDate}`, {
                    credentials: "include"
                })
                .then((res) => res.json())
                .then((data) => setSummary(data))
                .catch((err) => console.error(err));

                fetch(`http://localhost:8080/shifts/by-date?date=${formattedDate}`, {
                    credentials: "include"
                })
                .then((res) => res.json())
                .then((data) => {
                    setDayShifts(data);

                    data.forEach((shift) => {
                        fetch(`http://localhost:8080/shift-results/shift/${shift.shiftId}/summary`, {
                            credentials: "include"
                        })
                        .then((res) => res.json())
                        .then((summaryData) => {
                            setEmployeeSummaries(prev => ({
                            ...prev,
                            [shift.shiftId]: summaryData
                            }));
                        })
                        .catch((err) => console.error(err));
                    });
                })
                .catch((err) => console.error(err));
            }}
            value={date}
        />

        <h3 style={{ marginTop: "20px" }}>Dienas kopsavilkums</h3>

        {summary.length === 0 ? (
        <p>Datiem nav pieejams.</p>
        ) : (
            <ul>
                {summary.map((item, index) => (
                <li key={index}>
                    {item.category} | kopā: {item.totalAmount}
                </li>
                ))}
            </ul>
        )}


        <h3 style={{ marginTop: "20px" }}>Darbinieki šajā datumā</h3>

        {dayShifts.length === 0 ? (
        <p>Darbinieki nav atrasti.</p>
        ) : (
            <ul>
                {dayShifts.map((shift) => (
                <li key={shift.shiftId}>
                    <strong>{shift.firstName} {shift.lastName}</strong>

                    {employeeSummaries[shift.shiftId] ? (
                        <ul>
                        {employeeSummaries[shift.shiftId].map((item, index) => (
                            <li key={index}>
                            {item.category} | {item.totalAmount}
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p>Ielādē...</p>
                    )}
                </li>
                ))}
            </ul>
        )}



    </div>
  );
}

export default ManagerHomePage;