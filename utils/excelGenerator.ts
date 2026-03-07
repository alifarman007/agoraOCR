import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DeliveryChalanDocument } from '../types/delivery-chalan';

export const generateExcel = async (data: DeliveryChalanDocument) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Delivery Chalan');

  // Set default column width
  worksheet.properties.defaultColWidth = 15;

  // --- 1. TITLE ---
  worksheet.mergeCells('A1:H2');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'DELIVERY CHALAN';
  titleCell.font = { name: 'Arial', size: 16, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  let currentRow = 4;

  // --- 2. HEADER INFO (Supplier & Chalan Details) ---
  // Supplier Info (Left)
  worksheet.getCell(`A${currentRow}`).value = 'Supplier:';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.supplier.name || '';
  
  // Chalan Info (Right)
  worksheet.getCell(`F${currentRow}`).value = 'Chalan No:';
  worksheet.getCell(`F${currentRow}`).font = { bold: true };
  worksheet.getCell(`G${currentRow}`).value = data.chalan_number || '';
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = 'Address:';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.supplier.address || '';
  
  worksheet.getCell(`F${currentRow}`).value = 'Date:';
  worksheet.getCell(`F${currentRow}`).font = { bold: true };
  worksheet.getCell(`G${currentRow}`).value = data.date || '';
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = 'Phone:';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.supplier.phone || '';

  worksheet.getCell(`F${currentRow}`).value = 'PO No:';
  worksheet.getCell(`F${currentRow}`).font = { bold: true };
  worksheet.getCell(`G${currentRow}`).value = data.po_number || '';
  currentRow += 2;

  // --- 3. BUYER INFO ---
  worksheet.getCell(`A${currentRow}`).value = 'Buyer:';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.buyer.name || '';
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = 'Address:';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.buyer.address || '';
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = 'Phone:';
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = data.buyer.phone || '';
  currentRow++;

  if (data.delivery_address) {
    worksheet.getCell(`A${currentRow}`).value = 'Delivery Addr:';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = data.delivery_address || '';
    currentRow++;
  }
  currentRow++;

  // --- 4. LINE ITEMS TABLE ---
  const columns = data.line_items.columns;
  const rows = data.line_items.rows;

  // Table Headers
  const headerRow = worksheet.getRow(currentRow);
  columns.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = col.label;
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
  });
  currentRow++;

  // Table Rows
  rows.forEach((row) => {
    const dataRow = worksheet.getRow(currentRow);
    columns.forEach((col, index) => {
      const cell = dataRow.getCell(index + 1);
      cell.value = row.cells[col.id] || '';
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (col.type === 'number' || col.type === 'currency') {
        cell.alignment = { horizontal: 'right' };
      }
    });
    currentRow++;
  });
  currentRow++;

  // --- 5. SUMMARY / TOTALS ---
  if (data.summary && data.summary.length > 0) {
    const summaryStartCol = Math.max(1, columns.length - 1);
    data.summary.forEach((item) => {
      worksheet.getCell(currentRow, summaryStartCol).value = item.key;
      worksheet.getCell(currentRow, summaryStartCol).font = { bold: true };
      
      const valCell = worksheet.getCell(currentRow, summaryStartCol + 1);
      valCell.value = item.value;
      valCell.alignment = { horizontal: 'right' };
      valCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      currentRow++;
    });
  }
  currentRow++;

  // --- 6. ADDITIONAL METADATA ---
  if (data.additional_metadata && data.additional_metadata.length > 0) {
    worksheet.getCell(`A${currentRow}`).value = 'Additional Information:';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, underline: true };
    currentRow++;

    data.additional_metadata.forEach((item) => {
      worksheet.getCell(`A${currentRow}`).value = item.key + ':';
      worksheet.getCell(`A${currentRow}`).font = { bold: true };
      worksheet.getCell(`B${currentRow}`).value = item.value;
      currentRow++;
    });
  }

  // Adjust column widths based on content
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell!({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  // Generate and save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Delivery_Chalan_${data.chalan_number || 'Export'}.xlsx`);
};
