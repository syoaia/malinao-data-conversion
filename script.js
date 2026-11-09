(function (global) {
  const PROGRAM_MAP = {
    BSIT: 'Bachelor of Science in Information Technology',
    BSCS: 'Bachelor of Science in Computer Science',
  };

  function capitalizeWords(value) {
    return String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function parseCSV(csvText) {
    const rows = [];
    let currentRow = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i += 1) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentValue += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === ',' && !inQuotes) {
        currentRow.push(currentValue);
        currentValue = '';
        continue;
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i += 1;
        }

        currentRow.push(currentValue);
        const row = currentRow.filter((cell, index) => {
          if (index === currentRow.length - 1) {
            return cell !== '' || currentRow.some((entry) => entry !== '');
          }
          return true;
        });

        if (row.some((cell) => cell !== '')) {
          rows.push(row);
        }

        currentRow = [];
        currentValue = '';
        continue;
      }

      currentValue += char;
    }

    if (currentValue.length > 0 || currentRow.length > 0) {
      currentRow.push(currentValue);
      if (currentRow.some((cell) => cell !== '')) {
        rows.push(currentRow);
      }
    }

    if (!rows.length) {
      return [];
    }

    const [headers, ...dataRows] = rows;

    return dataRows.map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        const key = header.trim();
        record[key] = (row[index] ?? '').trim();
      });
      return record;
    });
  }

  function transformRecord(record) {
    const rawCourse = String(record.course ?? '').trim().toUpperCase();
    const rawBalance = String(record.tuition_balance ?? '0').trim();
    const parsedBalance = Number.parseFloat(rawBalance.replace(/[^0-9.-]/g, '')) || 0;

    return {
      studentId: Number.parseInt(String(record.student_id ?? '0').trim(), 10),
      firstName: capitalizeWords(record.first_name),
      lastName: capitalizeWords(record.last_name),
      program: PROGRAM_MAP[rawCourse] || capitalizeWords(record.course),
      yearLevel: Number.parseInt(String(record.year_level ?? '0').trim(), 10),
      emailAddress: String(record.email ?? '').trim().toLowerCase(),
      outstandingBalance: Number(parsedBalance.toFixed(2)),
    };
  }

  function transformCSVToJSON(csvText) {
    const records = parseCSV(csvText);
    return records.map(transformRecord);
  }

  function showJsonOutput(jsonText) {
    const outputElement = document.getElementById('jsonOutput');
    const statusElement = document.getElementById('status');

    if (!outputElement || !statusElement) {
      return;
    }

    outputElement.textContent = jsonText;
    statusElement.textContent = 'CSV successfully transformed into JSON.';
  }

  function handleSelectedFile(file) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = String(event.target?.result ?? '');
      const jsonData = transformCSVToJSON(csvText);
      showJsonOutput(JSON.stringify(jsonData, null, 2));
    };
    reader.readAsText(file);
  }

  function loadProvidedCsv() {
    fetch('./exercise_datamap.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not read the provided CSV file.');
        }
        return response.text();
      })
      .then((csvText) => {
        const jsonData = transformCSVToJSON(csvText);
        showJsonOutput(JSON.stringify(jsonData, null, 2));
      })
      .catch((error) => {
        const statusElement = document.getElementById('status');
        if (statusElement) {
          statusElement.textContent = error.message;
        }
      });
  }

  function initializeApp() {
    const csvFileInput = document.getElementById('csvFile');
    const convertButton = document.getElementById('convertBtn');
    const loadSampleButton = document.getElementById('loadSampleBtn');
    const downloadButton = document.getElementById('downloadBtn');

    if (!csvFileInput || !convertButton || !loadSampleButton || !downloadButton) {
      return;
    }

    csvFileInput.addEventListener('change', (event) => {
      const [file] = event.target.files;
      handleSelectedFile(file);
    });

    convertButton.addEventListener('click', () => {
      const file = csvFileInput.files[0];
      if (file) {
        handleSelectedFile(file);
      } else {
        loadProvidedCsv();
      }
    });

    loadSampleButton.addEventListener('click', loadProvidedCsv);

    downloadButton.addEventListener('click', () => {
      const outputElement = document.getElementById('jsonOutput');
      if (!outputElement) {
        return;
      }

      const payload = outputElement.textContent;
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'transformed-students.json';
      anchor.click();
      URL.revokeObjectURL(url);
    });

    loadProvidedCsv();
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initializeApp);
  }

  global.CSVToJSONApp = {
    parseCSV,
    transformRecord,
    transformCSVToJSON,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      parseCSV,
      transformRecord,
      transformCSVToJSON,
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
