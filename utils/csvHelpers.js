import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { loadExpenses, saveExpenses } from './storage';

// Helper to convert expenses to CSV format
const convertToCSV = (expenses) => {
    const headers = 'id,name,quantity,price,month,date\n';
    const rows = expenses.map(expense => {
        // Escape commas in fields to avoid CSV formatting issues
        const escapedName = expense.name.includes(',') ? `"${expense.name}"` : expense.name;
        return `${expense.id},${escapedName},${expense.quantity},${expense.price},${expense.month},${expense.date}`;
    }).join('\n');

    return headers + rows;
};

// Helper to parse CSV data back to expenses
const parseCSV = (csvString) => {
    try {
        const lines = csvString.split('\n');
        if (lines.length <= 1) {
            throw new Error('CSV file has no data rows');
        }

        const headers = lines[0].split(',');

        // Validate required headers
        const requiredHeaders = ['id', 'name', 'quantity', 'price', 'month', 'date'];
        for (const header of requiredHeaders) {
            if (!headers.includes(header)) {
                throw new Error(`CSV is missing required header: ${header}`);
            }
        }

        const expenses = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            // Handle quoted values with commas inside
            let line = lines[i];
            let inQuotes = false;
            let processedLine = '';
            let quoteBuffer = '';

            // Process quotes and commas
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                    if (!inQuotes && quoteBuffer) {
                        // Replace commas within quotes with a temporary placeholder
                        processedLine += quoteBuffer.replace(/,/g, '##COMMA##');
                        quoteBuffer = '';
                    }
                } else if (inQuotes) {
                    quoteBuffer += char;
                } else {
                    processedLine += char;
                }
            }

            if (quoteBuffer) {
                processedLine += quoteBuffer;
            }

            const values = processedLine.split(',');

            // Skip if the row doesn't have the correct number of values
            if (values.length !== headers.length) {
                console.warn(`Skipping row ${i}: incorrect number of values`);
                continue;
            }

            const expense = {};

            headers.forEach((header, index) => {
                let value = values[index];

                // Restore commas in values
                if (value && value.includes('##COMMA##')) {
                    value = value.replace(/##COMMA##/g, ',');
                }

                if (header === 'quantity') {
                    expense[header] = parseFloat(value) || 0;
                } else if (header === 'price') {
                    expense[header] = parseFloat(value) || 0;
                } else {
                    expense[header] = value || '';
                }
            });

            expenses.push(expense);
        }

        return expenses;
    } catch (error) {
        console.error('Error parsing CSV:', error);
        throw new Error(`Failed to parse CSV: ${error.message}`);
    }
};

export const exportToCSV = async () => {
    try {
        const expenses = await loadExpenses();
        if (!expenses || expenses.length === 0) {
            Alert.alert('No Data', 'There are no expenses to export');
            return;
        }

        const csvString = convertToCSV(expenses);
        const fileUri = `${FileSystem.documentDirectory}expenses.csv`;

        // Write the file first
        await FileSystem.writeAsStringAsync(fileUri, csvString);

        // Verify the file was created
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            throw new Error('Failed to create the file');
        }

        // Check if sharing is available before trying to share
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'text/csv',
                dialogTitle: 'Export Expenses',
                UTI: 'public.comma-separated-values-text'
            });
        } else {
            Alert.alert('Sharing not available', 'Sharing is not available on this device');
        }
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        Alert.alert('Export Error', `Could not export the data: ${error.message}`);
        throw error;
    }
};

export const importFromCSV = async () => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'text/csv',
            copyToCacheDirectory: true
        });

        if (result.type === 'success') {
            console.log('Selected file:', result.name);

            try {
                const fileContent = await FileSystem.readAsStringAsync(result.uri);
                console.log('File content loaded, length:', fileContent.length);

                const parsedExpenses = parseCSV(fileContent);
                console.log('Parsed expenses:', parsedExpenses.length);

                if (parsedExpenses.length > 0) {
                    // Get existing expenses first
                    const existingExpenses = await loadExpenses();
                    console.log('Existing expenses:', existingExpenses.length);

                    // Merge with existing expenses (replace duplicates by ID)
                    const expenseMap = new Map();
                    existingExpenses.forEach(exp => expenseMap.set(exp.id, exp));
                    parsedExpenses.forEach(exp => expenseMap.set(exp.id, exp));

                    const mergedExpenses = Array.from(expenseMap.values());
                    console.log('Merged expenses:', mergedExpenses.length);

                    // Save the merged expenses
                    await saveExpenses(mergedExpenses);

                    Alert.alert(
                        'Import Successful',
                        `Successfully imported ${parsedExpenses.length} expenses. Please restart the app or change months to see the imported data.`
                    );

                    return true;
                } else {
                    Alert.alert('Invalid Data', 'No valid expense data found in the file');
                }
            } catch (error) {
                console.error('Error processing CSV:', error);
                Alert.alert('Import Error', `Error processing CSV file: ${error.message}`);
            }
        } else if (result.type === 'cancel') {
            console.log('User cancelled the picker');
        }
        return false;
    } catch (error) {
        console.error('Error importing from CSV:', error);
        Alert.alert('Import Error', `Could not import the data: ${error.message}`);
        throw error;
    }
};
