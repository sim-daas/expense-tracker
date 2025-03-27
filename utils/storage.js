import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'expenses_data';

export const saveExpenses = async (expenses) => {
    try {
        console.log(`Saving ${expenses.length} expenses to storage`);
        const jsonValue = JSON.stringify(expenses);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log('Save completed');
        return true;
    } catch (e) {
        console.error('Failed to save expenses', e);
        return false;
    }
};

export const loadExpenses = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const parsedData = jsonValue ? JSON.parse(jsonValue) : [];
        console.log(`Loaded ${parsedData.length} expenses from storage`);
        return parsedData;
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

export const resetWithData = async (expenses) => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log('Storage cleared');

        if (expenses && expenses.length > 0) {
            return await saveExpenses(expenses);
        }
        return true;
    } catch (e) {
        console.error('Failed to reset expenses', e);
        return false;
    }
};
