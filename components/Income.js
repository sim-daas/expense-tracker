import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INCOME_STORAGE_KEY = 'income_data';

const Income = ({ expenses }) => {
    const [income, setIncome] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Load saved income on component mount
    useEffect(() => {
        loadIncome();
    }, []);

    // Calculate total expenses across all months
    const totalExpenses = expenses.reduce((total, expense) => {
        return total + (expense.quantity * expense.price);
    }, 0);

    // Calculate remaining balance
    const remainingBalance = income - totalExpenses;

    // Load income from AsyncStorage
    const loadIncome = async () => {
        try {
            const value = await AsyncStorage.getItem(INCOME_STORAGE_KEY);
            if (value !== null) {
                setIncome(parseFloat(value));
            }
        } catch (error) {
            console.error('Failed to load income', error);
        }
    };

    // Save income to AsyncStorage
    const saveIncome = async (value) => {
        try {
            await AsyncStorage.setItem(INCOME_STORAGE_KEY, value.toString());
        } catch (error) {
            console.error('Failed to save income', error);
        }
    };

    // Handle adding/updating income
    const handleUpdateIncome = () => {
        if (inputValue.trim() === '') return;

        const newIncome = parseFloat(inputValue) || 0;
        setIncome(newIncome);
        saveIncome(newIncome);
        setModalVisible(false);
        setInputValue('');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.displayContainer}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.label}>Balance:</Text>
                <Text style={[
                    styles.amount,
                    remainingBalance >= 0 ? styles.positive : styles.negative
                ]}>
                    ₹{remainingBalance.toFixed(2)}
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Income</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter income amount"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={inputValue}
                            onChangeText={setInputValue}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setInputValue('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleUpdateIncome}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    displayContainer: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    label: {
        color: '#CCCCCC',
        fontSize: 12,
        marginBottom: 2,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    positive: {
        color: '#4CD964', // Green for positive balance
    },
    negative: {
        color: '#FF3B30', // Red for negative balance
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        padding: 16,
        width: '80%',
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#FFF',
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 12,
        borderRadius: 6,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#555',
    },
    saveButton: {
        backgroundColor: '#4A58D9',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default Income;
