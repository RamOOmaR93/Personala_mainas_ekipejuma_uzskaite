import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

function ReportsPage({ currentUser }) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reportData, setReportData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const handleGenerateReport = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/shift-results/report/by-entry-date?from=${fromDate}&to=${toDate}`,
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data);
                setReportData([]);
                return;
            }

            setReportData(data);

        } catch (error) {
            console.error(error);
            setErrorMessage("Kļūda generējot atskaiti.");
        }
    };

    const normalizeText = (text) => {
        return text
            .replaceAll("ā", "a")
            .replaceAll("č", "c")
            .replaceAll("ē", "e")
            .replaceAll("ģ", "g")
            .replaceAll("ī", "i")
            .replaceAll("ķ", "k")
            .replaceAll("ļ", "l")
            .replaceAll("ņ", "n")
            .replaceAll("š", "s")
            .replaceAll("ū", "u")
            .replaceAll("ž", "z")
            .replaceAll("Ā", "A")
            .replaceAll("Č", "C")
            .replaceAll("Ē", "E")
            .replaceAll("Ģ", "G")
            .replaceAll("Ī", "I")
            .replaceAll("Ķ", "K")
            .replaceAll("Ļ", "L")
            .replaceAll("Ņ", "N")
            .replaceAll("Š", "S")
            .replaceAll("Ū", "U")
            .replaceAll("Ž", "Z");
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();

        // Logo
        doc.addImage(logo, "PNG", 85, 10, 40, 40);

        // Centered title
        doc.setFontSize(16);
        doc.text(normalizeText("Atskaites pārskats"), 105, 60, {
            align: "center"
        });

        // Centered period
        doc.setFontSize(11);
        doc.text(
            normalizeText(`Periods: ${fromDate} līdz ${toDate}`),
            105,
            70,
            {
                align: "center"
            }
        );

        autoTable(doc, {
            startY: 85,
            head: [["Kategorija", "Kopejais daudzums"]],
            body: reportData.map((item) => [
                normalizeText(item.category),
                item.totalAmount
            ])
        });

        doc.setFontSize(10);

        doc.text(
            `Atskaiti izveidoja: ${normalizeText(currentUser.firstName)} ${normalizeText(currentUser.lastName)}`,
            14,
            280
        );

        doc.save(`atskaite_${fromDate}_${toDate}.pdf`);
    };

    return (
        <div className="reports-layout">
            <div className="reports-sidebar">
                <div className="card">
                    <h2>Atskaites</h2>

                    <div className="form-group">
                        <label className="form-label">No datuma:</label>
                        <input
                            className="form-input"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Līdz datumam:</label>
                        <input
                            className="form-input"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <div className="report-actions">
                        <button className="btn" onClick={handleGenerateReport}>
                            Ģenerēt atskaiti
                        </button>

                        {reportData.length > 0 && (
                            <button className="btn btn-secondary" onClick={handleDownloadPdf}>
                                Lejupielādēt PDF
                            </button>
                        )}
                    </div>

                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>

            <div className="card report-table-card">
                <h3>Atskaites rezultāti</h3>

                {reportData.length === 0 ? (
                    <div className="report-empty">
                        Dati nav atrasti.
                    </div>
                ) : (
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th style={{ width: "70%" }}>Kategorija</th>
                                <th style={{ width: "30%" }}>Kopējais daudzums</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportData.map((item, index) => (
                                <tr key={index}>
                                    <td>{normalizeText(item.category)}</td>
                                    <td>{item.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ReportsPage;