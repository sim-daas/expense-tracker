import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { loadExpenses, saveExpenses } from './storage';

// Helper to convert expenses to CSV format
const convertToCSV = (expenses) => {
    const headers = 'id,name,quantity,price,month,date\n';
    const rows = expenses.map(expense =>
        `${expense.id},${expense.name},${expense.quantity},${expense.price},${expense.month},${expense.date}`
    ).join('\n');

    return headers + rows;
};

// Helper to parse CSV data back to expenses
const parseCSV = (csvString) => {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');

    const expenses = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',');
        const expense = {};

        headers.forEach((header, index) => {
            if (header === 'quantity' || header === 'price') {
                expense[header] = parseFloat(values[index]);
            } else {
                expense[header] = values[index];
            }
        });

        expenses.push(expense);
    }

    return expenses;
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

        await FileSystem.writeAsStringAsync(fileUri, csvString);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert('Sharing not available', 'Sharing is not available on this device');
        }
    } catch (error) {
        console.error('Error exporting to CSV:', error);
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
            const fileContent = await FileSystem.readAsStringAsync(result.uri);
            const parsedExpenses = parseCSV(fileContent);

            if (parsedExpenses.length > 0) {
                await saveExpenses(parsedExpenses);
                return true;
            } else {
                Alert.alert('Invalid Data', 'No valid expense data found in the file');
            }
        }
        return false;
    } catch (error) {
        console.error('Error importing from CSV:', error);
        throw error;
    }
};
