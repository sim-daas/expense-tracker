import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ExpenseForm = ({ onAddExpense, onEditExpense, editingExpense }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [price, setPrice] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (editingExpense) {
            setName(editingExpense.name);
            setQuantity(editingExpense.quantity.toString());
            setPrice(editingExpense.price.toString());
            setIsEditing(true);
        } else {
            resetForm();
            setIsEditing(false);
        }
    }, [editingExpense]);

    const resetForm = () => {
        setName('');
        setQuantity('1');
        setPrice('');
    };

    const handleSubmit = () => {
        if (!name || !price) return;

        const expenseData = {
            name,
            quantity: parseInt(quantity) || 1,
            price: parseFloat(price) || 0,
        };

        if (isEditing && editingExpense) {
            onEditExpense({ ...editingExpense, ...expenseData });
        } else {
            onAddExpense(expenseData);
        }

        resetForm();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Item name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
            />
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.quantityInput]}
                    placeholder="Qty"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                />
                <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="Price"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                <Text style={styles.addButtonText}>
                    {isEditing ? 'Update Expense' : 'Add Expense'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#333',
        color: '#FFF',
        padding: 12,
        borderRadius: 6,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quantityInput: {
        width: '30%',
    },
    priceInput: {
        width: '65%',
    },
    addButton: {
        backgroundColor: '#4A58D9',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default ExpenseForm;
