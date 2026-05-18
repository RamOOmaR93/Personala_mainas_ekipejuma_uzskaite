import React, { useState } from "react";

function ReportsPage() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reportData, setReportData] = useState([]);



    const handleGenerateReport = async () => {

    try {

        const response = await fetch(
            `http://localhost:8080/shift-results/report/by-entry-date?from=${fromDate}&to=${toDate}`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        setReportData(data);

    } catch (error) {
        console.error(error);
    }
};




    return (
        <div>
            <h2>Atskaites</h2>

            <div>
                <label>No datuma:</label>
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
            </div>

            <div>
                <label>Līdz datumam:</label>
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            <button onClick={handleGenerateReport}>
                Ģenerēt atskaiti
            </button>

            <h3 style={{ marginTop: "20px" }}>
                Atskaites rezultāti
            </h3>

            {reportData.length === 0 ? (
                <p>Dati nav atrasti.</p>
            ) : (
                <table
                    border="1"
                    cellPadding="8"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        marginTop: "10px"
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: "70%" }}>Kategorija</th>
                            <th style={{ width: "30%" }}>Kopējais daudzums</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.category}</td>
                                <td>{item.totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default ReportsPage;