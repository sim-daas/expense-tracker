import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INCOME_STORAGE_KEY = 'income_data';

const Income = ({ expenses }) => {
    const [balance, setBalance] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Load saved balance on component mount
    useEffect(() => {
        loadBalance();
    }, []);

    // Calculate total expenses across all months
    const totalExpenses = expenses.reduce((total, expense) => {
        return total + (expense.quantity * expense.price);
    }, 0);

    // Calculate remaining balance
    const remainingBalance = balance - totalExpenses;

    // Load balance from AsyncStorage
    const loadBalance = async () => {
        try {
            const value = await AsyncStorage.getItem(INCOME_STORAGE_KEY);
            if (value !== null) {
                setBalance(parseFloat(value));
            }
        } catch (error) {
            console.error('Failed to load balance', error);
        }
    };

    // Save balance to AsyncStorage
    const saveBalance = async (value) => {
        try {
            await AsyncStorage.setItem(INCOME_STORAGE_KEY, value.toString());
        } catch (error) {
            console.error('Failed to save balance', error);
        }
    };

    // Handle adding to balance
    const handleAddToBalance = () => {
        if (inputValue.trim() === '') return;

        const additionalAmount = parseFloat(inputValue) || 0;
        const newBalance = balance + additionalAmount;

        setBalance(newBalance);
        saveBalance(newBalance);
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
                        <Text style={styles.modalTitle}>Add to Balance</Text>

                        <Text style={styles.currentBalanceText}>
                            Current Balance: ₹{balance.toFixed(2)}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount to add"
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
                                onPress={handleAddToBalance}
                            >
                                <Text style={styles.buttonText}>Add</Text>
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
    currentBalanceText: {
        color: '#CCCCCC',
        fontSize: 14,
        marginBottom: 12,
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
