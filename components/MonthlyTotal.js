import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MonthlyTotal = ({ expenses, month }) => {
    // Calculate total amount spent in the month
    const totalAmount = expenses
        .filter(expense => expense.month === month)
        .reduce((total, expense) => total + (expense.quantity * expense.price), 0);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Month:</Text>
            <Text style={styles.amount}>₹{totalAmount.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        alignItems: 'center',
        minWidth: 100,
    },
    label: {
        color: '#CCCCCC',
        fontSize: 12,
        marginBottom: 2,
    },
    amount: {
        color: '#4A58D9',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default MonthlyTotal;
