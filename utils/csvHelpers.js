import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Platform } from 'react-native';
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
        // Get the document with updated options for newer Expo versions
        let result;
        try {
            result = await DocumentPicker.getDocumentAsync({
                type: ["text/csv", "text/comma-separated-values"],
                copyToCacheDirectory: true
            });
        } catch (e) {
            console.error("Error picking document:", e);
            Alert.alert("Error", "Could not open document picker");
            return false;
        }

        console.log("Document picker result:", JSON.stringify(result));

        // Handle both older and newer DocumentPicker API versions
        const isSuccess = result.type === 'success' || result.canceled === false;
        const uri = result.uri || (result.assets && result.assets[0]?.uri);

        if (isSuccess && uri) {
            console.log('Selected file URI:', uri);

            try {
                // Read the file content
                const fileContent = await FileSystem.readAsStringAsync(uri);
                console.log('File content loaded, length:', fileContent.length);
                console.log('First 100 chars:', fileContent.substring(0, 100));

                if (!fileContent || fileContent.trim() === '') {
                    throw new Error('File is empty');
                }

                // Parse the CSV data
                const parsedExpenses = parseCSV(fileContent);
                console.log('Parsed expenses count:', parsedExpenses.length);

                if (parsedExpenses.length > 0) {
                    // Force a save with the new data
                    await saveExpenses(parsedExpenses);
                    console.log('Saved imported expenses');

                    // Verify the save worked
                    const savedExpenses = await loadExpenses();
                    console.log('Verified expense count after save:', savedExpenses.length);

                    Alert.alert(
                        'Import Successful',
                        `Imported ${parsedExpenses.length} expenses. The app will now reload data.`,
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    console.log('User acknowledged import');
                                    return true;
                                }
                            }
                        ]
                    );

                    return true;
                } else {
                    Alert.alert('Invalid Data', 'No valid expense data found in the file');
                    return false;
                }
            } catch (error) {
                console.error('Error processing CSV:', error);
                Alert.alert('Import Error', `Error processing file: ${error.message}`);
                return false;
            }
        } else {
            console.log('User cancelled or picker failed');
            return false;
        }
    } catch (error) {
        console.error('Error in importFromCSV:', error);
        Alert.alert('Import Error', `Could not import the data: ${error.message}`);
        return false;
    }
};
