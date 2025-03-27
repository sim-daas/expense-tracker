import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

// Import components
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

// Import utilities
import { loadExpenses, saveExpenses } from './utils/storage';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [editingExpense, setEditingExpense] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Load expenses on first render
  useEffect(() => {
    loadExpensesFromStorage();
  }, []);

  // Filter expenses when selected month changes or expenses change
  useEffect(() => {
    filterExpensesByMonth();
  }, [selectedMonth, expenses]);

  // Get current month name
  function getCurrentMonth() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  }

  // Load expenses from AsyncStorage
  const loadExpensesFromStorage = async () => {
    const storedExpenses = await loadExpenses();
    setExpenses(storedExpenses);
  };

  // Filter expenses based on selected month
  const filterExpensesByMonth = () => {
    const filtered = expenses.filter(expense => expense.month === selectedMonth);
    // Sort expenses by date (newest first)
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredExpenses(sorted);
  };

  // Handle adding a new expense
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      month: selectedMonth,
      date: new Date().toISOString(),
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Handle editing an expense
  const handleEditExpense = (editedExpense) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === editedExpense.id ? editedExpense : expense
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setEditingExpense(null);
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Handle month selection
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  // Add a reference to reload data
  const reloadData = async () => {
    await loadExpensesFromStorage();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('./assets/background.gif')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <Header onDataChanged={reloadData} />

          <View style={styles.content}>
            <MonthSelector
              selectedMonth={selectedMonth}
              onSelectMonth={handleMonthSelect}
            />

            <ExpenseForm
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              editingExpense={editingExpense}
            />

            <View style={styles.listContainer}>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={setEditingExpense}
                onDelete={handleDeleteExpense}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark theme background
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
});
