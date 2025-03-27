import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthSelector = ({ selectedMonth, onSelectMonth }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleMonthSelect = (month) => {
        onSelectMonth(month);
        toggleModal();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={toggleModal}
            >
                <Text style={styles.selectorText}>{selectedMonth}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={months}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.monthItem,
                                        selectedMonth === item && styles.selectedMonth
                                    ]}
                                    onPress={() => handleMonthSelect(item)}
                                >
                                    <Text
                                        style={[
                                            styles.monthText,
                                            selectedMonth === item && styles.selectedMonthText
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 12,
    },
    selectorButton: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    selectorText: {
        color: '#FFFFFF',
        fontSize: 16,
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
        maxHeight: '70%',
    },
    monthItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    selectedMonth: {
        backgroundColor: '#2C2C2C',
    },
    monthText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    selectedMonthText: {
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#444',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default MonthSelector;
