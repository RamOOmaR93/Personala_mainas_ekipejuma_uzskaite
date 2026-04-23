import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function ManagerHomePage({ onLogout }) {
    const [date, setDate] = useState(new Date());
    const [summary, setSummary] = useState([]);
    const [dayShifts, setDayShifts] = useState([]);
    const [employeeSummaries, setEmployeeSummaries] = useState({});
    const [employees, setEmployees] = useState([]); // List of employees (workers) for dropdown selection
    const [selectedUserId, setSelectedUserId] = useState("");// Selected employee ID for report
    const [fromDate, setFromDate] = useState("");// Selected period (from / to)
    const [toDate, setToDate] = useState("");// Selected period (from / to)
    const [employeePeriodSummary, setEmployeePeriodSummary] = useState([]); // Summary results for selected employee and period



    // Load all users and filter only employees for dropdown
    useEffect(() => {
        fetch("http://localhost:8080/users")
            .then((res) => res.json())
            .then((data) => {
            const onlyWorkers = data.filter(user => user.role === "DARBINIEKS");
            setEmployees(onlyWorkers);
            })
            .catch((err) => console.error(err));
    }, []);



    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    // Loads shift-based summary for the selected employee within the selected period
    const handleLoadEmployeePeriodSummary = () => {
        if (!selectedUserId) {
            alert("Lūdzu, izvēlieties darbinieku");
            return;
        }

        if (!fromDate || !toDate) {
            alert("Lūdzu, aizpildiet perioda sākuma un beigu datumus");
            return;
        }

        fetch(`http://localhost:8080/shift-results/summary/user-by-period?userId=${selectedUserId}&from=${fromDate}&to=${toDate}`)
            .then((res) => res.json())
            .then((data) => setEmployeePeriodSummary(data))
            .catch((err) => console.error(err));
    };




  return (
    <div style={{ padding: "20px" }}>
      <h2>Sveiks Priekšniek</h2>
      <button onClick={onLogout}>Izlogoties</button>
      <p>ATSKAITĒM/PĀRSKATS</p>


        <h3 style={{ marginTop: "30px" }}>
            Darbinieka pārskats pa maiņām periodā
            </h3>

            {/* Employee selection */}
            <div>
            <label>Darbinieks:</label>
            <br />
            <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
            >
                <option value="">-- Izvēlies darbinieku --</option>
                {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                </option>
                ))}
            </select>
            </div>

            {/* From date */}
            <div style={{ marginTop: "10px" }}>
            <label>No:</label>
            <br />
            <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
            />
            </div>

            {/* To date */}
            <div style={{ marginTop: "10px" }}>
            <label>Līdz:</label>
            <br />
            <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
            />
            </div>

            {/* Button to trigger report fetch */}
        <button style={{ marginTop: "10px" }} onClick={handleLoadEmployeePeriodSummary}>
            Iegūt pārskatu
        </button>
        <h4 style={{ marginTop: "20px" }}>Darbinieka perioda kopsavilkums</h4>

        {employeePeriodSummary.length === 0 ? (
            <p>Pārskata dati nav pieejami.</p>
        ) : (
            <ul>
                {employeePeriodSummary.map((item, index) => (
                    <li key={index}>
                        {item.category} | kopā: {item.totalAmount}
                    </li>
                ))}
            </ul>
        )}




      <h3 style={{ marginTop: "20px" }}>Izvēlies datumu</h3>

        <Calendar
            onChange={(selectedDate) => {
                setDate(selectedDate);

                const formattedDate = formatLocalDate(selectedDate);

                // Load total summary for all shifts started on selected date
                fetch(`http://localhost:8080/shift-results/summary/by-shift-date?date=${formattedDate}`, {
                    credentials: "include"
                })
                .then((res) => res.json())
                .then((data) => setSummary(data))
                .catch((err) => console.error(err));

                // Load all employees who had a shift on selected date
                fetch(`http://localhost:8080/shifts/by-date?date=${formattedDate}`, {
                    credentials: "include"
                })
                .then((res) => res.json())
                .then((data) => {
                    setDayShifts(data);

                    data.forEach((shift) => {
                        // Load summary for each employee's shift separately
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