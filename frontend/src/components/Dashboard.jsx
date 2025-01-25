import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ApexCharts from 'react-apexcharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: []
      },
      title: {
        text: 'Excel Data Visualization'
      }
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Customize data extraction based on your Excel structure
      const categories = worksheet.map(row => Object.keys(row)[0]);
      const values = worksheet.map(row => Object.values(row)[1]);

      setChartData({
        series: [{
          name: 'Values',
          data: values
        }],
        options: {
          ...chartData.options,
          xaxis: {
            categories: categories
          }
        }
      });
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          Excel File Data Visualizer
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input 
              type="file" 
              className="form-control" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload}
            />
          </div>
          
          {chartData.series.length > 0 && (
            <ApexCharts 
              options={chartData.options} 
              series={chartData.series} 
              type="bar" 
              height={350} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;