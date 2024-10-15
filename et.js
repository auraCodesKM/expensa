document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseItemsList = document.getElementById('expense-items');
    const expenseChart = document.getElementById('expense-chart');
    const totalExpensesElement = document.getElementById('total-expenses');
    const highestExpenseElement = document.getElementById('highest-expense');
    const commonCategoryElement = document.getElementById('common-category');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseCategories = {
        food: 0,
        entertainment: 0,
        movies: 0,
        travel: 0,
        bills: 0,
    };

    let myChart = null;

    function updateExpenseList() {
        expenseItemsList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})</span>
                <button onclick="removeExpense(${index})">Remove</button>
            `;
            expenseItemsList.appendChild(listItem);
        });
    }

    function updateExpenseSummary() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const highest = expenses.reduce((max, expense) => Math.max(max, expense.amount), 0);
        const categoryCounts = expenses.reduce((counts, expense) => {
            counts[expense.category] = (counts[expense.category] || 0) + 1;
            return counts;
        }, {});
        const commonCategory = Object.entries(categoryCounts).reduce((a, b) => a[1] > b[1] ? a : b, [null, 0])[0];

        totalExpensesElement.textContent = total.toFixed(2);
        highestExpenseElement.textContent = highest.toFixed(2);
        commonCategoryElement.textContent = commonCategory ? commonCategory.charAt(0).toUpperCase() + commonCategory.slice(1) : 'N/A';
    }

    function updateChart() {
        Object.keys(expenseCategories).forEach(category => {
            expenseCategories[category] = 0;
        });

        expenses.forEach(expense => {
            expenseCategories[expense.category] += expense.amount;
        });

        const chartLabels = Object.keys(expenseCategories);
        const chartData = Object.values(expenseCategories);

        const chartColors = {
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
        };

        if (myChart) {
            myChart.data.datasets[0].data = chartData;
            myChart.update();
        } else {
            myChart = new Chart(expenseChart, {
                type: 'doughnut',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Expenses by Category',
                        data: chartData,
                        backgroundColor: chartColors.backgroundColor,
                        borderColor: chartColors.borderColor,
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: '#ebd3f8',
                                font: {
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Expense Distribution',
                            color: '#ebd3f8',
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        },
                    },
                },
            });
        }
    }

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        const expenseDate = document.getElementById('expense-date').value;
        const expenseCategory = document.getElementById('expense-category').value;

        expenses.push({
            name: expenseName,
            amount: expenseAmount,
            date: expenseDate,
            category: expenseCategory
        });

        localStorage.setItem('expenses', JSON.stringify(expenses));

        updateExpenseList();
        updateExpenseSummary();
        updateChart();

        expenseForm.reset();
    });

    window.removeExpense = function(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateExpenseList();
        updateExpenseSummary();
        updateChart();
    };

    updateExpenseList();
    updateExpenseSummary();
    updateChart();
});
