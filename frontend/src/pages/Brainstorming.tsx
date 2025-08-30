import React, { useState } from 'react';
import { Lightbulb, Plus, Trash2, Edit3, Save, X, Tag, Calendar } from 'lucide-react';
import IdeaGenerationBoard from '../components/IdeaGenerationBoard';

interface Idea {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'new' | 'in-progress' | 'completed' | 'archived';
    createdAt: string;
    tags: string[];
}

const Brainstorming = () => {
    const [ideas, setIdeas] = useState<Idea[]>([
        {
            id: '1',
            title: 'AI-Powered Price Prediction',
            description: 'Implement machine learning algorithms to predict future price trends based on historical data and market patterns.',
            category: 'Feature Enhancement',
            priority: 'high',
            status: 'new',
            createdAt: new Date().toISOString(),
            tags: ['AI', 'Machine Learning', 'Pricing']
        },
        {
            id: '2',
            title: 'Competitor Analysis Dashboard',
            description: 'Create a dedicated section to compare products with competitors, showing price differences and market positioning.',
            category: 'New Feature',
            priority: 'medium',
            status: 'in-progress',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            tags: ['Analytics', 'Competition', 'Dashboard']
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium' as const,
        tags: ''
    });

    // Listen for generated ideas from the generation board
    React.useEffect(() => {
        const handleAddGeneratedIdea = (event: CustomEvent) => {
            setIdeas(prev => [event.detail, ...prev]);
        };

        window.addEventListener('addGeneratedIdea', handleAddGeneratedIdea as EventListener);
        return () => {
            window.removeEventListener('addGeneratedIdea', handleAddGeneratedIdea as EventListener);
        };
    }, []);

    const categories = ['New Feature', 'Feature Enhancement', 'UI/UX Improvement', 'Performance', 'Integration', 'Research'];
    const priorities = ['low', 'medium', 'high'] as const;
    const statuses = ['new', 'in-progress', 'completed', 'archived'] as const;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newIdea: Idea = {
            id: editingId || Date.now().toString(),
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority,
            status: 'new',
            createdAt: editingId ? ideas.find(i => i.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        if (editingId) {
            setIdeas(ideas.map(idea => idea.id === editingId ? newIdea : idea));
            setEditingId(null);
        } else {
            setIdeas([newIdea, ...ideas]);
        }

        setFormData({ title: '', description: '', category: '', priority: 'medium', tags: '' });
        setShowForm(false);
    };

    const handleEdit = (idea: Idea) => {
        setFormData({
            title: idea.title,
            description: idea.description,
            category: idea.category,
            priority: idea.priority,
            tags: idea.tags.join(', ')
        });
        setEditingId(idea.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setIdeas(ideas.filter(idea => idea.id !== id));
    };

    const handleStatusChange = (id: string, status: Idea['status']) => {
        setIdeas(ideas.map(idea => idea.id === id ? { ...idea, status } : idea));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-orange-100 text-orange-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Lightbulb className="h-8 w-8 text-yellow-500 mr-3" />
                        Brainstorming & Ideas
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Capture, organize, and track your innovative ideas for SellSight
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>New Idea</span>
                </button>
            </div>
            {/* Quick Stats */}
            {ideas.length > 0 && (
                <div className="mt-12 bg-gray-50 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ideas Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{ideas.length}</div>
                            <div className="text-sm text-gray-600">Total Ideas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {ideas.filter(i => i.status === 'in-progress').length}
                            </div>
                            <div className="text-sm text-gray-600">In Progress</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {ideas.filter(i => i.status === 'completed').length}
                            </div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {ideas.filter(i => i.priority === 'high').length}
                            </div>
                            <div className="text-sm text-gray-600">High Priority</div>
                        </div>
                    </div>
                </div>
            )}
            {/* Idea Generation Board */}
            <div className="mb-8">
                <IdeaGenerationBoard />
            </div>

            {/* Idea Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingId ? 'Edit Idea' : 'Add New Idea'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setFormData({ title: '', description: '', category: '', priority: 'medium', tags: '' });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter idea title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe your idea in detail..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {priorities.map(priority => (
                                            <option key={priority} value={priority}>
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter tags separated by commas..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setFormData({ title: '', description: '', category: '', priority: 'medium', tags: '' });
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{editingId ? 'Update' : 'Save'} Idea</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                    <div key={idea.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{idea.description}</p>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(idea)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(idea.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {idea.category}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                                    {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
                                </span>
                            </div>

                            {idea.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {idea.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(idea.createdAt).toLocaleDateString()}
                                </div>

                                <select
                                    value={idea.status}
                                    onChange={(e) => handleStatusChange(idea.id, e.target.value as Idea['status'])}
                                    className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${getStatusColor(idea.status)} cursor-pointer`}
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {ideas.length === 0 && (
                <div className="text-center py-12">
                    <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
                    <p className="text-gray-500 mb-6">Start brainstorming by adding your first idea!</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Idea
                    </button>
                </div>
            )}


        </div>
    );
};

export default Brainstorming;