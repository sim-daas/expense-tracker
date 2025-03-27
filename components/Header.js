import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { exportToCSV, importFromCSV } from '../utils/csvHelpers';
import { resetWithData, loadExpenses } from '../utils/storage';

const Header = ({ onDataChanged }) => {
    const handleExport = async () => {
        try {
            await exportToCSV();
            Alert.alert('Success', 'Data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert('Error', `Failed to export data: ${error.message}`);
        }
    };

    const handleImport = async () => {
        try {
            console.log('Starting import process');
            const result = await importFromCSV();
            console.log('Import result:', result);

            if (result) {
                console.log('Import successful, reloading data');
                // Ensure we have the latest data
                const expenses = await loadExpenses();
                console.log(`Loaded ${expenses.length} expenses after import`);

                // Force a full reload of the app's data
                if (onDataChanged && typeof onDataChanged === 'function') {
                    console.log('Calling onDataChanged callback');
                    onDataChanged();
                } else {
                    console.warn('onDataChanged is not a function:', onDataChanged);
                }

                // Show success notification after callback
                Alert.alert('Import Complete',
                    `Successfully loaded ${expenses.length} expenses. You should now see them in the app.`);
            }
        } catch (error) {
            console.error('Import error:', error);
            Alert.alert('Error', `Failed to import data: ${error.message}`);
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleExport}
                >
                    <Text style={styles.buttonText}>Export</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleImport}
                >
                    <Text style={styles.buttonText}>Import</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Expense Tracker</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});

export default Header;
