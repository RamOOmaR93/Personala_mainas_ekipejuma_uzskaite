import { useState, useEffect } from "react";
import Calendar from "react-calendar";// Import React Calendar component and its default styles
import "react-calendar/dist/Calendar.css";

function ManagerHomePage({ onLogout, setCurrentPage }) {
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
    <div style={{ padding: "20px" }}>
      <h2>Sveiks Priekšniek</h2>
        <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            marginTop: "10px"
        }}>
            <button onClick={() => setManagerSection("reports")}>
                Pārskati
            </button>

            <button onClick={() => setManagerSection("employees")}>
                Darbinieki
            </button>

            <button onClick={() => setManagerSection("equipment")}>
                Ekipējums
            </button>

            <button onClick={onLogout}>
                Izlogoties
            </button>
        </div>
      
      {managerSection === "reports" && (
      <>
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


    </>
         )}
    {managerSection === "employees" && (
        <div>
            <h3>Darbinieki</h3>

            {employees.length === 0 ? (
                <p>Darbinieki nav atrasti.</p>
            ) : (
                <ul>
                    {employees.map((employee) => (
                        <li key={employee.id}>
                            {employee.firstName} {employee.lastName}
                            {" | "}
                            {employee.active ? "Aktīvs" : "Neaktīvs"}

                            <button
                                style={{ marginLeft: "10px" }}
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
                        </li>
                    ))}
                </ul> 
            )}
            {selectedEmployee && (
                <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}>
                    <h4>Darbinieka informācija</h4>

                    <p><strong>Vārds:</strong> {selectedEmployee.firstName}</p>
                    <p><strong>Uzvārds:</strong> {selectedEmployee.lastName}</p>
                    <p><strong>Lietotājvārds:</strong> {selectedEmployee.username}</p>
                    <p><strong>Loma:</strong> {selectedEmployee.role}</p>
                    <p><strong>Statuss:</strong> {selectedEmployee.active ? "Aktīvs" : "Neaktīvs"}</p>
                    <button
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
                    <p><strong>Personas kods:</strong> {selectedEmployee.personalCode || "-"}</p>
                    <p><strong>Tālrunis:</strong> {selectedEmployee.phoneNumber || "-"}</p>

                    <h4>Ekipējums</h4>

                    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>Ekipējums</th>
                                <th style={{ width: "15%" }}>Statuss</th>
                                <th style={{ width: "15%" }}>Izsniegts</th>
                                <th style={{ width: "50%" }}>Piezīmes</th>
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
                                            {assignment
                                                ? assignment.active
                                                    ? "Aktīvs"
                                                    : "Neaktīvs"
                                                : "Nav piešķirts"}
                                        </td>

                                        <td>
                                            {assignment?.issuedDate || "-"}
                                        </td>

                                        <td>
                                            {assignment?.notes || "-"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )}

    {managerSection === "equipment" && (
        <div>
            <h3>Ekipējuma pārvaldība</h3>

            <div style={{ marginBottom: "20px" }}>
                <h4>Pievienot jaunu ekipējumu</h4>

                <input
                    type="text"
                    placeholder="Ekipējuma nosaukums"
                    value={newEquipmentName}
                    onChange={(e) => setNewEquipmentName(e.target.value)}
                />

                <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => {

                        fetch("http://localhost:8080/equipment-items", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                name: newEquipmentName
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





            <div style={{ marginTop: "20px" }}>
                <label>Darbinieks:</label>
                <br />

                <select
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
                {selectedUserId && (
                    <div style={{ marginTop: "20px" }}>
                        <h4>Ekipējuma saraksts</h4>

                        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "15%" }}>Darbība</th>
                                    <th style={{ width: "25%" }}>Ekipējums</th>
                                    <th style={{ width: "15%" }}>Statuss</th>
                                    <th style={{ width: "15%" }}>Izsniegts</th>
                                    <th style={{ width: "30%" }}>Piezīmes</th>
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
                                                        <>
                                                            <button
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
                                                                style={{ marginLeft: "5px" }}
                                                                onClick={() => {
                                                                    setEditingEquipmentId(null);
                                                                    setEquipmentNote("");
                                                                    setEquipmentIssuedDate("");
                                                                }}
                                                            >
                                                                Atcelt
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
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
                                                    <>
                                                        <button
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
                                                            style={{ marginLeft: "5px" }}
                                                            onClick={() => {
                                                                setEditingEquipmentId(null);
                                                                setEquipmentNote("");
                                                                setEquipmentIssuedDate("");
                                                            }}
                                                        >
                                                            Atcelt
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setEditingEquipmentId(item.id)}>
                                                        Piešķirt
                                                    </button>
                                                )}
                                            </td>
                                            <td>{item.name}</td>
                                            <td>
                                                {editingEquipmentId === item.id && assignment ? (
                                                    <select
                                                        value={equipmentActive}
                                                        onChange={(e) => setEquipmentActive(e.target.value === "true")}
                                                    >
                                                        <option value="true">Aktīvs</option>
                                                        <option value="false">Neaktīvs</option>
                                                    </select>
                                                ) : assignment ? (
                                                    assignment.active ? "Aktīvs" : "Neaktīvs"
                                                ) : (
                                                    "Nav piešķirts"
                                                )}
                                            </td>
                                            <td>
                                                {editingEquipmentId === item.id ? (
                                                    <input
                                                        type="date"
                                                        value={equipmentIssuedDate}
                                                        onChange={(e) => setEquipmentIssuedDate(e.target.value)}
                                                    />
                                                ) : (
                                                    assignment?.issuedDate || "-"
                                                )}
                                            </td>
                                            <td>
                                                {editingEquipmentId === item.id ? (
                                                    <input
                                                        type="text"
                                                        placeholder="Piezīmes"
                                                        style={{ width: "100%" }}
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
                    </div>
                )}
                
                
            </div>

            <p>
                Šeit būs ekipējuma piešķiršana un rediģēšana.
            </p>
        </div>
    )}
    </div>
  );
}

export default ManagerHomePage;