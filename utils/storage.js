import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'expenses_data';

export const saveExpenses = async (expenses) => {
    try {
        const jsonValue = JSON.stringify(expenses);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        return true;
    } catch (e) {
        console.error('Failed to save expenses', e);
        return false;
    }
};

export const loadExpenses = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load expenses', e);
        return [];
    }
};

export const clearExpenses = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (e) {
        console.error('Failed to clear expenses', e);
        return false;
    }
};
