import React, { useState } from "react";
import Pagination from "./Pagination";

const DataTable = ({ data, latestData, theme }) => {
  const [showLatestRunOnly, setShowLatestRunOnly] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const deviceTypes = [...new Set(data.map((d) => d.device))];

  let filteredData = showLatestRunOnly ? latestData : data;

  if (deviceFilter !== "All") {
    filteredData = filteredData.filter((d) => d.device === deviceFilter);
  }

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = filteredData.slice(start, end);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateAverageData = (data) => {
    const totalTests = data.length;
    return {
      performance_metrics:
        data.reduce((sum, d) => sum + d.performance_metrics, 0) / totalTests,
      accessibility_metrics:
        data.reduce((sum, d) => sum + d.accessibility_metrics, 0) / totalTests,
      seo_metrics: data.reduce((sum, d) => sum + d.seo_metrics, 0) / totalTests,
      best_practice_metrics:
        data.reduce((sum, d) => sum + d.best_practice_metrics, 0) / totalTests,
    };
  };

  const avgData = calculateAverageData(data);

  return (
    <div className="card" style={{ margin: "20px", overflow: "hidden" }}>
      <div style={{ padding: "20px" }}>
        <h2
          style={{
            color: "var(--text-primary)",
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          All Performance Test Results
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showLatestRunOnly}
              onChange={() => {
                setShowLatestRunOnly(!showLatestRunOnly);
                setCurrentPage(1);
              }}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
            Latest Run Result
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label
              htmlFor="tableDeviceFilter"
              style={{ color: "var(--text-secondary)" }}
            >
              Filter by Device:
            </label>
            <select
              id="tableDeviceFilter"
              value={deviceFilter}
              onChange={(e) => {
                setDeviceFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <option value="All">All</option>
              {deviceTypes.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "var(--card-bg)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  fontSize: "14px",
                }}
              >
                <th style={tableHeaderStyle}>Test Name</th>
                <th style={tableHeaderStyle}>Device Type</th>
                <th style={tableHeaderStyle}>Performance</th>
                <th style={tableHeaderStyle}>Accessibility</th>
                <th style={tableHeaderStyle}>SEO</th>
                <th style={tableHeaderStyle}>Best Practice</th>
                <th style={tableHeaderStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d) => (
                <tr
                  key={`${d.scenario}-${d.created_at}`}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      theme === "dark"
                        ? "var(--hover-bg-dark)"
                        : "var(--hover-bg-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={tableCellStyle}>{d.scenario}</td>
                  <td style={tableCellStyle}>{d.device}</td>
                  <td style={tableCellStyle}>{d.performance_metrics}</td>
                  <td style={tableCellStyle}>{d.accessibility_metrics}</td>
                  <td style={tableCellStyle}>{d.seo_metrics}</td>
                  <td style={tableCellStyle}>{d.best_practice_metrics}</td>
                  <td style={tableCellStyle}>{formatDate(d.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          <div className="pagination-info">
            Showing {start + 1}-{Math.min(end, filteredData.length)} of{" "}
            {filteredData.length} results
          </div>
        </div>
        <div>
          {filteredData.length > rowsPerPage && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  whiteSpace: 'nowrap'
};

const tableCellStyle = {
  padding: '12px 16px',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap'
};

export default DataTable;