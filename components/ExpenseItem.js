import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.name}>{expense.name}</Text>
                <Text style={styles.quantity}>Qty: {expense.quantity}</Text>
                <Text style={styles.price}>₹{expense.price.toFixed(2)}</Text>
                <Text style={styles.total}>
                    Total: ₹{(expense.quantity * expense.price).toFixed(2)}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => onEdit(expense)}
                >
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => onDelete(expense.id)}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 6,
        padding: 8, // Reduced padding
        marginBottom: 6, // Reduced margin
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    details: {
        flex: 1,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 14, // Reduced from 16
        fontWeight: 'bold',
        marginBottom: 2, // Reduced from 4
    },
    quantity: {
        color: '#CCCCCC',
        fontSize: 12, // Reduced from 14
    },
    price: {
        color: '#CCCCCC',
        fontSize: 12, // Reduced from 14
    },
    total: {
        color: '#4A58D9',
        fontSize: 12, // Reduced from 14
        fontWeight: 'bold',
        marginTop: 2, // Reduced from 4
    },
    actions: {
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 3, // Reduced padding
        paddingHorizontal: 8, // Reduced padding
        borderRadius: 4,
        marginBottom: 3, // Reduced margin
    },
    editButton: {
        backgroundColor: '#4A58D9',
    },
    deleteButton: {
        backgroundColor: '#D93A4A',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 10, // Reduced from 12
    }
});

export default ExpenseItem;
