document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterInput = document.getElementById('filter-input');
    const filterStatus = document.getElementById('filter-status');
    const filterButton = document.getElementById('filter-button');
    const deleteAllButton = document.getElementById('delete-all-button');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const createTodoItem = (todo) => {
        const listItem = document.createElement('li');
        listItem.dataset.id = todo.id;
        listItem.classList.add('todo-item');
        if (todo.completed) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <span class="todo-date">${todo.date}</span>
            <div class="actions">
                <button class="complete-btn" aria-label="Tandai selesai">${todo.completed ? '↩️' : '✔️'}</button>
                <button class="delete-btn" aria-label="Hapus tugas">🗑️</button>
            </div>
        `;
        return listItem;
    };

    const renderTodos = () => {
        todoList.innerHTML = '';

        const searchTerm = filterInput.value.toLowerCase();
        const statusFilter = filterStatus.value;

        const filteredTodos = todos.filter(todo => {
            const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
            const matchesStatus = (statusFilter === 'all') ||
                                  (statusFilter === 'completed' && todo.completed) ||
                                  (statusFilter === 'pending' && !todo.completed);
            return matchesSearch && matchesStatus;
        });

        filteredTodos.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(a.date) - new Date(b.date);
        });

        if (filteredTodos.length > 0) {
            filteredTodos.forEach(todo => {
                todoList.appendChild(createTodoItem(todo));
            });
        } else {
            todoList.innerHTML = '<p class="no-todos-message">No task found</p>';
        }
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const todoText = todoInput.value.trim();
        const todoDate = dateInput.value;

        if (!todoText || !todoDate) {
            alert('Task and Date cannot be empty!');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: todoText,
            date: todoDate,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();

        todoInput.value = '';
        dateInput.value = '';
        todoInput.focus();
    });

    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('.todo-item');

        if (!listItem) return;

        const todoId = parseInt(listItem.dataset.id);

        if (target.classList.contains('delete-btn')) {
            todos = todos.filter(todo => todo.id !== todoId);
            saveTodos();
            renderTodos();
        } else if (target.classList.contains('complete-btn')) {
            todos = todos.map(todo =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            );
            saveTodos();
            renderTodos();
        }
    });

    filterInput.addEventListener('input', renderTodos);

    filterStatus.addEventListener('change', renderTodos);

    filterButton.addEventListener('click', () => {
        renderTodos();
    });

    deleteAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    });

    renderTodos();
});