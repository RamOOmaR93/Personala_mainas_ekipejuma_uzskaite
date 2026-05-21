import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function HomePage({ user, onStartShift, onOpenShift, onLogout }) {
  const [shifts, setShifts] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedShiftSummary, setSelectedShiftSummary] = useState([]);

  const [employeeSection, setEmployeeSection] = useState("shifts");
  const [myEquipment, setMyEquipment] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);

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
        const sorted = data.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        setShifts(sorted);
      })
      .catch((err) => console.error(err));
  }, [user.id]);

  useEffect(() => {
    fetch(`http://localhost:8080/users/${user.id}/equipment`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("My equipment data:", data);

        if (Array.isArray(data)) {
          setMyEquipment(data);
        } else {
          setMyEquipment([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setMyEquipment([]);
      });
  }, [user.id]);

  useEffect(() => {
    fetch("http://localhost:8080/equipment-items", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("All equipment items:", data);

        if (Array.isArray(data)) {
          setEquipmentItems(data);
        } else {
          setEquipmentItems([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setEquipmentItems([]);
      });
  }, []);

  const today = formatLocalDate(new Date());

  const activeShift = shifts.find(
    (shift) => shift.startTime.split("T")[0] === today
  );

  const hasTodayShift = shifts.some(
    (shift) => shift.startTime.split("T")[0] === today
  );

  const shiftDates = shifts.map((shift) => shift.startTime.split("T")[0]);

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

      <div className="manager-navbar">
        <button
          className={`manager-nav-button ${
            employeeSection === "shifts" ? "manager-nav-active" : ""
          }`}
          onClick={() => setEmployeeSection("shifts")}
        >
          Maiņas
        </button>

        <button
          className={`manager-nav-button ${
            employeeSection === "equipment" ? "manager-nav-active" : ""
          }`}
          onClick={() => setEmployeeSection("equipment")}
        >
          Mans ekipējums
        </button>
      </div>

      {employeeSection === "shifts" && (
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
                const foundShift = shifts.find(
                  (shift) => shift.startTime.split("T")[0] === formattedDate
                );

                setSelectedShift(foundShift || null);

                if (foundShift) {
                  fetch(
                    `http://localhost:8080/shift-results/shift/${foundShift.id}/summary`,
                    {
                      credentials: "include"
                    }
                  )
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

                if (
                  formattedDate === today &&
                  shiftDates.includes(formattedDate)
                ) {
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
      )}

      {employeeSection === "equipment" && (
        <div className="card equipment-table-card">
          <h3>Mans ekipējums</h3>

          {equipmentItems.length === 0 ? (
              <p className="empty-state">Ekipējuma saraksts nav pieejams.</p>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>Ekipējums</th>
                  <th style={{ width: "15%" }}>Statuss</th>
                  <th style={{ width: "15%" }}>Izsniegts</th>
                  <th style={{ width: "45%" }}>Piezīmes</th>
                </tr>
              </thead>

              <tbody>
                {equipmentItems.map((item) => {
                  const assignment = myEquipment.find(
                    (a) => a.equipmentItem?.id === item.id
                  );

                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>

                      <td>
                        {assignment ? (
                          <span
                            className={`status-badge ${
                              assignment.active ? "status-active" : "status-inactive"
                            }`}
                          >
                            {assignment.active ? "Aktīvs" : "Neaktīvs"}
                          </span>
                        ) : (
                          <span className="text-muted">Nav piešķirts</span>
                        )}
                      </td>

                      <td>{assignment?.issuedDate || "-"}</td>
                      <td>{assignment?.notes || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;