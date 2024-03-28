import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportExcel = ({ excelData, fileName }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = ".xlsx";
  
  console.log("excelData:", excelData); 

  const exportToExcel = () => {
    try {
    console.log("Generating Excel...");
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      console.log("excelBuffer:", excelBuffer); 

      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <button onClick={exportToExcel}>Excel Export</button>
  );
};

export default ExportExcel;
