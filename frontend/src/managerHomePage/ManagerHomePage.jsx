import { useState, useEffect } from "react";
import Calendar from "react-calendar";// Import React Calendar component and its default styles
import "react-calendar/dist/Calendar.css";
import ReportsPage from "../reports/ReportsPage";


function ManagerHomePage({ user, onLogout, setCurrentPage, onOpenShift }) {
    const [date, setDate] = useState(new Date());
    const [summary, setSummary] = useState([]);
    const [dayShifts, setDayShifts] = useState([]);
    const [employeeSummaries, setEmployeeSummaries] = useState({});
    const [employees, setEmployees] = useState([]); // List of employees (workers) for dropdown selection
    const [selectedUserId, setSelectedUserId] = useState("");// Selected employee ID for report
    const [fromDate, setFromDate] = useState("");// Selected period (from / to)
    const [toDate, setToDate] = useState("");// Selected period (from / to)
    const [employeePeriodSummary, setEmployeePeriodSummary] = useState([]); // Summary results for selected employee and period
    const [activePage, setActivePage] = useState("reports");
    const [managerSection, setManagerSection] = useState("reports");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployeeEquipment, setSelectedEmployeeEquipment] = useState([]);
    const [equipmentItems, setEquipmentItems] = useState([]);
    const [editingEquipmentId, setEditingEquipmentId] = useState(null);
    const [equipmentNote, setEquipmentNote] = useState("");
    const [equipmentIssuedDate, setEquipmentIssuedDate] = useState("");
    const [equipmentActive, setEquipmentActive] = useState(true);
    const [newEquipmentName, setNewEquipmentName] = useState("");
    



    // Load all users and filter only employees for dropdown
    useEffect(() => {
        fetch("http://localhost:8080/users", { 
            credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
            const onlyWorkers = data.filter(user => user.role === "DARBINIEKS");
            setEmployees(onlyWorkers);
            })
            .catch((err) => console.error(err));
    }, []);


    useEffect(() => {
        fetch("http://localhost:8080/equipment-items", {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setEquipmentItems(data))
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

        fetch(`http://localhost:8080/shift-results/summary/user-by-period?userId=${selectedUserId}&from=${fromDate}&to=${toDate}`, {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setEmployeePeriodSummary(data))
            .catch((err) => console.error(err));
    };




  return (
    <div className="page-container">

        <div className="page-header">
            <div>
            <h2 className="page-title">Vadības Panelis</h2>

            <p className="page-subtitle">
                Sveiks, {user.username}
            </p>
            </div>

            <button className="btn btn-secondary" onClick={onLogout}>
            Izlogoties
            </button>
        </div>
        <div className="manager-navbar">
            <button
                className={`manager-nav-button ${
                    managerSection === "reports" ? "manager-nav-active" : ""
                }`}
                onClick={() => setManagerSection("reports")}
            >
                Pārskati
            </button>

            <button
                className={`manager-nav-button ${
                    managerSection === "employees" ? "manager-nav-active" : ""
                }`}
                onClick={() => setManagerSection("employees")}
            >
                Darbinieki
            </button>

            <button
                className={`manager-nav-button ${
                    managerSection === "equipment" ? "manager-nav-active" : ""
                }`}
                onClick={() => setManagerSection("equipment")}
            >
                Ekipējums
            </button>

            <button
                className={`manager-nav-button ${
                    managerSection === "reportsPage" ? "manager-nav-active" : ""
                }`}
                onClick={() => setManagerSection("reportsPage")}
            >
                Atskaites
            </button>

            
        </div>
      
    {managerSection === "reports" && (
        <div className="manager-reports-grid">

            <div className="card">
                <h3>Darbinieka pārskats pa maiņām periodā</h3>

                {/* Employee Selection */}
                <div className="form-group">
                <label>Darbinieks:</label>

                <select
                    className="form-input"
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

                {/* Period Start Date */}
                <div className="form-group">
                <label>No:</label>

                <input
                    className="form-input"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                </div>

                {/* Period End Date */}
                <div className="form-group">
                <label>Līdz:</label>

                <input
                    className="form-input"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
                </div>

                <button className="btn" onClick={handleLoadEmployeePeriodSummary}>
                Iegūt pārskatu
                </button>

                <h4>Darbinieka perioda kopsavilkums</h4>

                {employeePeriodSummary.length === 0 ? (
                <p className="text-muted">Pārskata dati nav pieejami.</p>
                ) : (
                <div className="summary-list">
                    {employeePeriodSummary.map((item, index) => (
                    <div className="summary-row" key={index}>
                        <span>{item.category}</span>
                        <strong>Kopā: {item.totalAmount}</strong>
                    </div>
                    ))}
                </div>
                )}
            </div>


        <div className="card">

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
                <div className="summary-list">
                    {summary.map((item, index) => (
                        <div className="summary-row" key={index}>
                        <span>{item.category}</span>
                        <strong>Kopā: {item.totalAmount}</strong>
                        </div>
                    ))}
                </div>
            )}
        


        <h3 style={{ marginTop: "20px" }}>Darbinieki šajā datumā</h3>

        {dayShifts.length === 0 ? (
        <p>Darbinieki nav atrasti.</p>
        ) : (
            <div className="employee-shift-list">
                {dayShifts.map((shift) => (
                    <div className="employee-shift-card" key={shift.shiftId}>

                    <div className="employee-shift-header">
                        <strong>
                        {shift.firstName} {shift.lastName}
                        </strong>

                        <button
                        className="btn"
                        onClick={() => onOpenShift({
                            id: shift.shiftId,
                            startTime: shift.startTime,
                            endTime: shift.endTime,
                            openedByManager: true
                        })}
                        >
                        Atvērt maiņu
                        </button>
                    </div>

                    {employeeSummaries[shift.shiftId] ? (
                        <div className="summary-list">
                        {employeeSummaries[shift.shiftId].map((item, index) => (
                            <div className="summary-row" key={index}>
                            <span>{item.category}</span>
                            <strong>{item.totalAmount}</strong>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted">Ielādē...</p>
                    )}
                    </div>
                ))}
                </div>
        )}
        </div>

    </div>
         )}

        


    {managerSection === "reportsPage" && (
        <ReportsPage currentUser={user} />
    )}

    {managerSection === "employees" && (
        <div className="employees-grid">

            <div className="card employee-list-card">
                <h3>Darbinieki</h3>

                {employees.length === 0 ? (
                    <p className="empty-state">Darbinieki nav atrasti.</p>
                ) : (
                    <div className="employee-shift-list">
                        {employees.map((employee) => (
                            <div className="employee-shift-card employee-list-item" key={employee.id}>
                                <div>
                                    <div className="employee-name">
                                        {employee.firstName} {employee.lastName}
                                    </div>

                                    <span className={`status-badge ${
                                        employee.active ? "status-active" : "status-inactive"
                                    }`}>
                                        {employee.active ? "Aktīvs" : "Neaktīvs"}
                                    </span>
                                </div>

                                <button
                                    className="btn"
                                    onClick={() => {
                                        setSelectedEmployee(employee);

                                        fetch(`http://localhost:8080/users/${employee.id}/equipment`, {
                                            credentials: "include"
                                        })
                                            .then((res) => res.json())
                                            .then((data) => setSelectedEmployeeEquipment(data))
                                            .catch((err) => console.error(err));
                                    }}
                                >
                                    Skatīt
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card employee-details-card">
                {!selectedEmployee ? (
                    <p className="empty-state">Izvēlies darbinieku, lai skatītu informāciju.</p>
                ) : (
                    <div>
                        <div className="section-header">
                            <h3>Darbinieka informācija</h3>

                            <span className={`status-badge ${
                                selectedEmployee.active ? "status-active" : "status-inactive"
                            }`}>
                                {selectedEmployee.active ? "Aktīvs" : "Neaktīvs"}
                            </span>
                        </div>

                        <div className="employee-info-grid">
                            <div className="info-box">
                                <span className="info-label">Vārds</span>
                                <span className="info-value">{selectedEmployee.firstName}</span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">Uzvārds</span>
                                <span className="info-value">{selectedEmployee.lastName}</span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">Lietotājvārds</span>
                                <span className="info-value">{selectedEmployee.username}</span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">Loma</span>
                                <span className="info-value">{selectedEmployee.role}</span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">Personas kods</span>
                                <span className="info-value">{selectedEmployee.personalCode || "-"}</span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">Tālrunis</span>
                                <span className="info-value">{selectedEmployee.phoneNumber || "-"}</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const updatedEmployee = {
                                    ...selectedEmployee,
                                    active: !selectedEmployee.active
                                };

                                fetch(`http://localhost:8080/users/${selectedEmployee.id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    credentials: "include",
                                    body: JSON.stringify(updatedEmployee)
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        setSelectedEmployee(data);

                                        setEmployees((prev) =>
                                            prev.map((employee) =>
                                                employee.id === data.id ? data : employee
                                            )
                                        );
                                    })
                                    .catch((err) => console.error(err));
                            }}
                        >
                            {selectedEmployee.active ? "Deaktivizēt darbinieku" : "Aktivizēt darbinieku"}
                        </button>

                        <h3 style={{ marginTop: "28px" }}>Ekipējums</h3>

                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "22%" }}>Ekipējums</th>
                                    <th style={{ width: "15%" }}>Statuss</th>
                                    <th style={{ width: "15%" }}>Izsniegts</th>
                                    <th style={{ width: "48%" }}>Piezīmes</th>
                                </tr>
                            </thead>

                            <tbody>
                                {equipmentItems.map((item) => {
                                    const assignment = selectedEmployeeEquipment.find(
                                        (a) => a.equipmentItem?.id === item.id
                                    );

                                    return (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>

                                            <td>
                                                {assignment ? (
                                                    <span className={`status-badge ${
                                                        assignment.active ? "status-active" : "status-inactive"
                                                    }`}>
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
                    </div>
                )}
            </div>
        </div>
    )}

    {managerSection === "equipment" && (
    <>
        <h3>Ekipējuma pārvaldība</h3>

        <div className="equipment-layout">
            <div className="equipment-sidebar">
                <div className="card">
                    <h4>Pievienot jaunu ekipējumu</h4>

                    <div className="form-row">
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Ekipējuma nosaukums"
                            value={newEquipmentName}
                            onChange={(e) => setNewEquipmentName(e.target.value)}
                        />

                        <button
                            className="btn"
                            onClick={() => {
                                const trimmedName = newEquipmentName.trim();

                                if (!trimmedName) {
                                    alert("Lūdzu, ievadiet ekipējuma nosaukumu.");
                                    return;
                                }

                                const confirmed = window.confirm(
                                    `Vai tiešām vēlaties pievienot jaunu ekipējumu: "${trimmedName}"?`
                                );

                                if (!confirmed) {
                                    return;
                                }

                                fetch("http://localhost:8080/equipment-items", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({
                                        name: trimmedName
                                    })
                                })
                                    .then((res) => res.json())
                                    .then(() => {
                                        return fetch("http://localhost:8080/equipment-items", {
                                            credentials: "include"
                                        });
                                    })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        setEquipmentItems(data);
                                        setNewEquipmentName("");
                                    })
                                    .catch((err) => console.error(err));
                            }}
                        >
                            Pievienot
                        </button>
                    </div>
                </div>

                <div className="card">
                    <label className="form-label">Darbinieks:</label>

                    <select
                        className="form-input"
                        value={selectedUserId}
                        onChange={(e) => {
                            const userId = e.target.value;
                            setSelectedUserId(userId);

                            if (!userId) {
                                setSelectedEmployeeEquipment([]);
                                return;
                            }

                            fetch(`http://localhost:8080/users/${userId}/equipment`, {
                                credentials: "include"
                            })
                                .then((res) => res.json())
                                .then((data) => setSelectedEmployeeEquipment(data))
                                .catch((err) => console.error(err));
                        }}
                    >
                        <option value="">-- Izvēlies darbinieku --</option>

                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card equipment-table-card">
                <h4>Ekipējuma saraksts</h4>

                {!selectedUserId ? (
                    <p className="empty-state">
                        Izvēlies darbinieku, lai skatītu un piešķirtu ekipējumu.
                    </p>
                ) : (
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th style={{ width: "12%" }}>Darbība</th>
                                <th style={{ width: "23%" }}>Ekipējums</th>
                                <th style={{ width: "15%" }}>Statuss</th>
                                <th style={{ width: "15%" }}>Izsniegts</th>
                                <th style={{ width: "35%" }}>Piezīmes</th>
                            </tr>
                        </thead>

                        <tbody>
                            {equipmentItems.map((item) => {
                                const assignment = selectedEmployeeEquipment.find(
                                    (a) => a.equipmentItem?.id === item.id
                                );

                                return (
                                    <tr key={item.id}>
                                        <td>
                                            {assignment ? (
                                                editingEquipmentId === item.id ? (
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-small"
                                                            onClick={() => {
                                                                const requestBody = {
                                                                    userId: Number(selectedUserId),
                                                                    equipmentItemId: item.id,
                                                                    issuedDate: equipmentIssuedDate,
                                                                    notes: equipmentNote,
                                                                    active: equipmentActive
                                                                };

                                                                fetch(`http://localhost:8080/users/assignments/${assignment.id}`, {
                                                                    method: "PUT",
                                                                    headers: {
                                                                        "Content-Type": "application/json"
                                                                    },
                                                                    credentials: "include",
                                                                    body: JSON.stringify(requestBody)
                                                                })
                                                                    .then((res) => res.json())
                                                                    .then(() => {
                                                                        return fetch(`http://localhost:8080/users/${selectedUserId}/equipment`, {
                                                                            credentials: "include"
                                                                        });
                                                                    })
                                                                    .then((res) => res.json())
                                                                    .then((data) => {
                                                                        setSelectedEmployeeEquipment(data);
                                                                        setEditingEquipmentId(null);
                                                                        setEquipmentNote("");
                                                                        setEquipmentIssuedDate("");
                                                                    })
                                                                    .catch((err) => console.error(err));
                                                            }}
                                                        >
                                                            Saglabāt
                                                        </button>

                                                        <button
                                                            className="btn btn-small btn-secondary"
                                                            onClick={() => {
                                                                setEditingEquipmentId(null);
                                                                setEquipmentNote("");
                                                                setEquipmentIssuedDate("");
                                                            }}
                                                        >
                                                            Atcelt
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-small"
                                                        onClick={() => {
                                                            setEditingEquipmentId(item.id);
                                                            setEquipmentIssuedDate(assignment.issuedDate || "");
                                                            setEquipmentNote(assignment.notes || "");
                                                            setEquipmentActive(assignment.active);
                                                        }}
                                                    >
                                                        Rediģēt
                                                    </button>
                                                )
                                            ) : editingEquipmentId === item.id ? (
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-small"
                                                        onClick={() => {
                                                            const requestBody = {
                                                                userId: Number(selectedUserId),
                                                                equipmentItemId: item.id,
                                                                issuedDate: equipmentIssuedDate,
                                                                notes: equipmentNote,
                                                                active: true
                                                            };

                                                            fetch("http://localhost:8080/users/assignments", {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                credentials: "include",
                                                                body: JSON.stringify(requestBody)
                                                            })
                                                                .then((res) => res.json())
                                                                .then(() => {
                                                                    return fetch(`http://localhost:8080/users/${selectedUserId}/equipment`, {
                                                                        credentials: "include"
                                                                    });
                                                                })
                                                                .then((res) => res.json())
                                                                .then((data) => {
                                                                    setSelectedEmployeeEquipment(data);
                                                                    setEditingEquipmentId(null);
                                                                    setEquipmentNote("");
                                                                    setEquipmentIssuedDate("");
                                                                })
                                                                .catch((err) => console.error(err));
                                                        }}
                                                    >
                                                        Saglabāt
                                                    </button>

                                                    <button
                                                        className="btn btn-small btn-secondary"
                                                        onClick={() => {
                                                            setEditingEquipmentId(null);
                                                            setEquipmentNote("");
                                                            setEquipmentIssuedDate("");
                                                        }}
                                                    >
                                                        Atcelt
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-small"
                                                    onClick={() => setEditingEquipmentId(item.id)}
                                                >
                                                    Piešķirt
                                                </button>
                                            )}
                                        </td>

                                        <td>{item.name}</td>

                                        <td>
                                            {editingEquipmentId === item.id && assignment ? (
                                                <select
                                                    className="form-input"
                                                    value={equipmentActive}
                                                    onChange={(e) => setEquipmentActive(e.target.value === "true")}
                                                >
                                                    <option value="true">Aktīvs</option>
                                                    <option value="false">Neaktīvs</option>
                                                </select>
                                            ) : assignment ? (
                                                <span className={`status-badge ${
                                                    assignment.active ? "status-active" : "status-inactive"
                                                }`}>
                                                    {assignment.active ? "Aktīvs" : "Neaktīvs"}
                                                </span>
                                            ) : (
                                                <span className="text-muted">Nav piešķirts</span>
                                            )}
                                        </td>

                                        <td>
                                            {editingEquipmentId === item.id ? (
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={equipmentIssuedDate}
                                                    onChange={(e) => setEquipmentIssuedDate(e.target.value)}
                                                />
                                            ) : (
                                                assignment?.issuedDate || "-"
                                            )}
                                        </td>

                                        <td>
                                            {editingEquipmentId === item.id ? (
                                                <textarea
                                                    className="form-input"
                                                    placeholder="Piezīmes"
                                                    rows="3"
                                                    value={equipmentNote}
                                                    onChange={(e) => setEquipmentNote(e.target.value)}
                                                />
                                            ) : (
                                                assignment?.notes || "-"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </>
)}
    </div>
    
  );
  
}

export default ManagerHomePage;