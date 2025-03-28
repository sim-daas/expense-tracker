import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
    if (expenses.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No expenses for this month</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ExpenseItem
                    expense={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
            initialNumToRender={10}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
    },
});

export default ExpenseList;
