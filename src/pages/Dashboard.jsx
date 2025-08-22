import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';
import Header from '../components/Header';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

     useEffect(() => {
     fetchTodos();
  }, []);

  const fetchTodos = async () => {
     try {
      const response = await axiosInstance.get('/todos');
      setTodos(response.data);
     } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos');
     }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/todos', {
        title,
        description,
        status,
      });
      setTodos([...todos, response.data.todo]);
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('pending');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo');
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditStatus(todo.status);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/todos/${editId}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
      setTodos(todos.map((todo) => (todo._id === editId ? response.data.todo : todo)));
      setIsModalOpen(false);
      setEditId(null);
      setEditTitle('');
      setEditDescription('');
      setEditStatus('pending');
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
    setEditStatus('pending');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Todo Dashboard
          </h1>

          {/* Create Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Create Todo
            </h2>
            <form onSubmit={handleCreate}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                  placeholder="Enter todo title"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows="4"
                  placeholder="Enter todo description"
                />
              </div>
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={status === 'completed'}
                    onChange={(e) => setStatus(e.target.checked ? 'completed' : 'pending')}
                    className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Completed
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Create Todo
              </button>
            </form>
          </div>

          {/* Todo List */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Your Todos
            </h2>
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center">No todos found.</p>
            ) : (
              <ul className="space-y-4">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-start sm:justify-between bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-medium text-gray-800">
                        {todo.title}
                      </h3>
                      <p className="text-gray-600">{todo.description || 'No description'}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        Status: {todo.status}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Update Todo
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                  placeholder="Enter todo title"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows="4"
                  placeholder="Enter todo description"
                />
              </div>
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editStatus === 'completed'}
                    onChange={(e) => setEditStatus(e.target.checked ? 'completed' : 'pending')}
                    className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Completed
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Update Todo
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

