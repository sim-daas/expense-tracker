import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';

// Import components
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import MonthlyTotal from './components/MonthlyTotal';
import Income from './components/Income'; // Add this import

// Import utilities
import { loadExpenses, saveExpenses } from './utils/storage';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [editingExpense, setEditingExpense] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadExpensesFromStorage();
  }, []);

  useEffect(() => {
    filterExpensesByMonth();
  }, [selectedMonth, expenses]);

  function getCurrentMonth() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  }

  const loadExpensesFromStorage = async () => {
    const storedExpenses = await loadExpenses();
    setExpenses(storedExpenses);
  };

  const filterExpensesByMonth = () => {
    const filtered = expenses.filter(expense => expense.month === selectedMonth);
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredExpenses(sorted);
  };

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

  const handleEditExpense = (editedExpense) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === editedExpense.id ? editedExpense : expense
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const reloadData = useCallback(async () => {
    console.log('Reloading expenses data');
    try {
      const storedExpenses = await loadExpenses();
      console.log(`Reloaded ${storedExpenses.length} expenses`);
      setExpenses(storedExpenses);
      setRefreshKey(prevKey => prevKey + 1);
      console.log('Current selected month:', selectedMonth);
    } catch (error) {
      console.error('Error reloading data:', error);
      Alert.alert('Error', 'Failed to reload data');
    }
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
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
            <View style={styles.monthRow}>
              <MonthlyTotal expenses={expenses} month={selectedMonth} />
              <Income expenses={expenses} />
              <MonthSelector
                selectedMonth={selectedMonth}
                onSelectMonth={handleMonthSelect}
              />
            </View>

            <ExpenseForm
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              editingExpense={editingExpense}
            />

            <View style={styles.listContainer}>
              <ExpenseList
                key={`expense-list-${refreshKey}-${selectedMonth}`}
                expenses={filteredExpenses}
                onEdit={setEditingExpense}
                onDelete={handleDeleteExpense}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});
