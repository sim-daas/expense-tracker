import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { exportToCSV, importFromCSV } from '../utils/csvHelpers';

const Header = () => {
    const handleExport = async () => {
        try {
            await exportToCSV();
            Alert.alert('Success', 'Data exported successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        }
    };

    const handleImport = async () => {
        try {
            await importFromCSV();
            Alert.alert('Success', 'Data imported successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to import data');
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
