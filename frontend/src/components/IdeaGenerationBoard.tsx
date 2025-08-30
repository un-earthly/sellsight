import  { useState } from 'react';
import { Sparkles, RefreshCw, Target, Users, Zap, TrendingUp, DollarSign, Globe } from 'lucide-react';

interface GeneratedIdea {
    title: string;
    description: string;
    category: string;
    tags: string[];
    inspiration: string;
}

const IdeaGenerationBoard = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
    const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

    const ideaPrompts = [
        { id: 'market-gaps', label: 'Market Gaps', icon: Target, description: 'Find underserved market opportunities' },
        { id: 'user-pain', label: 'User Pain Points', icon: Users, description: 'Address customer frustrations' },
        { id: 'automation', label: 'Automation', icon: Zap, description: 'Automate manual processes' },
        { id: 'trends', label: 'Emerging Trends', icon: TrendingUp, description: 'Capitalize on new trends' },
        { id: 'monetization', label: 'Revenue Streams', icon: DollarSign, description: 'New ways to generate income' },
        { id: 'expansion', label: 'Market Expansion', icon: Globe, description: 'Enter new markets or regions' },
    ];

    const ideaTemplates = {
        'market-gaps': [
            {
                title: 'Real-time Inventory Alerts',
                description: 'Notify sellers when competitor inventory drops below threshold, indicating potential demand surge opportunities.',
                category: 'New Feature',
                tags: ['Alerts', 'Inventory', 'Competition'],
                inspiration: 'Market gap in real-time inventory monitoring'
            },
            {
                title: 'Seasonal Demand Predictor',
                description: 'AI model that predicts seasonal demand patterns for different product categories based on historical data.',
                category: 'Feature Enhancement',
                tags: ['AI', 'Seasonality', 'Prediction'],
                inspiration: 'Gap in seasonal planning tools'
            },
            {
                title: 'Micro-Niche Discovery Engine',
                description: 'Tool to identify profitable micro-niches by analyzing low-competition, high-demand product combinations.',
                category: 'New Feature',
                tags: ['Niche', 'Discovery', 'Analytics'],
                inspiration: 'Underserved niche identification market'
            }
        ],
        'user-pain': [
            {
                title: 'One-Click Competitor Analysis',
                description: 'Simplify competitor research with automated reports comparing pricing, features, and market positioning.',
                category: 'UI/UX Improvement',
                tags: ['Automation', 'Competition', 'Reports'],
                inspiration: 'Users struggle with manual competitor research'
            },
            {
                title: 'Smart Price Optimization Wizard',
                description: 'Guided workflow that suggests optimal pricing based on competition, demand, and profit margins.',
                category: 'New Feature',
                tags: ['Pricing', 'Optimization', 'Wizard'],
                inspiration: 'Pricing decisions are complex and time-consuming'
            },
            {
                title: 'Visual Trend Dashboard',
                description: 'Replace complex data tables with intuitive visual representations of market trends and opportunities.',
                category: 'UI/UX Improvement',
                tags: ['Visualization', 'Dashboard', 'UX'],
                inspiration: 'Data overload frustrates users'
            }
        ],
        'automation': [
            {
                title: 'Auto-Generated Market Reports',
                description: 'Automatically generate weekly market analysis reports with key insights and recommendations.',
                category: 'Feature Enhancement',
                tags: ['Automation', 'Reports', 'AI'],
                inspiration: 'Manual report creation is time-consuming'
            },
            {
                title: 'Smart Alert System',
                description: 'Intelligent notifications that learn user preferences and only alert on truly relevant market changes.',
                category: 'New Feature',
                tags: ['AI', 'Alerts', 'Personalization'],
                inspiration: 'Reduce notification fatigue through automation'
            },
            {
                title: 'Automated Competitor Tracking',
                description: 'Set up automated monitoring of specific competitors with daily updates on their pricing and product changes.',
                category: 'Feature Enhancement',
                tags: ['Automation', 'Competition', 'Monitoring'],
                inspiration: 'Manual competitor tracking is inefficient'
            }
        ],
        'trends': [
            {
                title: 'Social Media Trend Integration',
                description: 'Incorporate social media trending topics and hashtags to predict emerging product demand.',
                category: 'Integration',
                tags: ['Social Media', 'Trends', 'Prediction'],
                inspiration: 'Social trends drive product demand'
            },
            {
                title: 'Sustainability Score Tracker',
                description: 'Track and score products based on sustainability metrics as eco-consciousness grows.',
                category: 'New Feature',
                tags: ['Sustainability', 'ESG', 'Scoring'],
                inspiration: 'Growing trend toward sustainable products'
            },
            {
                title: 'Voice Commerce Analytics',
                description: 'Analyze voice search patterns and optimize product listings for voice commerce platforms.',
                category: 'New Feature',
                tags: ['Voice', 'SEO', 'Analytics'],
                inspiration: 'Rise of voice-activated shopping'
            }
        ],
        'monetization': [
            {
                title: 'Premium Analytics Tier',
                description: 'Advanced analytics features including predictive modeling and custom report generation for enterprise users.',
                category: 'New Feature',
                tags: ['Premium', 'Analytics', 'Enterprise'],
                inspiration: 'Monetize advanced features'
            },
            {
                title: 'API Access Marketplace',
                description: 'Offer paid API access to our market data for third-party developers and businesses.',
                category: 'New Feature',
                tags: ['API', 'Marketplace', 'B2B'],
                inspiration: 'Data as a service revenue model'
            },
            {
                title: 'Consultation Services',
                description: 'Offer expert market analysis consultation services based on our platform insights.',
                category: 'New Feature',
                tags: ['Services', 'Consultation', 'Expert'],
                inspiration: 'Monetize expertise and insights'
            }
        ],
        'expansion': [
            {
                title: 'Multi-Platform Integration',
                description: 'Expand beyond current platforms to include international marketplaces like Alibaba, Rakuten, and regional platforms.',
                category: 'Integration',
                tags: ['International', 'Platforms', 'Expansion'],
                inspiration: 'Global market expansion opportunity'
            },
            {
                title: 'B2B Wholesale Analytics',
                description: 'Specialized analytics for wholesale markets and B2B transactions with different metrics and insights.',
                category: 'New Feature',
                tags: ['B2B', 'Wholesale', 'Analytics'],
                inspiration: 'Untapped B2B market segment'
            },
            {
                title: 'Mobile App Companion',
                description: 'Native mobile app for on-the-go market monitoring and quick decision making.',
                category: 'New Feature',
                tags: ['Mobile', 'App', 'Accessibility'],
                inspiration: 'Mobile-first market expansion'
            }
        ]
    };

    const handlePromptToggle = (promptId: string) => {
        setSelectedPrompts(prev =>
            prev.includes(promptId)
                ? prev.filter(id => id !== promptId)
                : [...prev, promptId]
        );
    };

    const generateIdeas = async () => {
        setIsGenerating(true);

        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newIdeas: GeneratedIdea[] = [];

        selectedPrompts.forEach(promptId => {
            const templates = ideaTemplates[promptId as keyof typeof ideaTemplates];
            if (templates) {
                // Randomly select 1-2 ideas from each selected prompt
                const numIdeas = Math.floor(Math.random() * 2) + 1;
                const shuffled = [...templates].sort(() => 0.5 - Math.random());
                newIdeas.push(...shuffled.slice(0, numIdeas));
            }
        });

        setGeneratedIdeas(newIdeas);
        setIsGenerating(false);
    };

    const addIdeaToCollection = (idea: GeneratedIdea) => {
        // This would typically call a parent function to add the idea to the main collection
        console.log('Adding idea to collection:', idea);
        // For now, just remove it from generated ideas
        setGeneratedIdeas(prev => prev.filter(i => i !== idea));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Idea Generation Board</h2>
                        <p className="text-sm text-gray-600">Select inspiration sources to generate new ideas</p>
                    </div>
                </div>

                <button
                    onClick={generateIdeas}
                    disabled={selectedPrompts.length === 0 || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generate Ideas</span>
                        </>
                    )}
                </button>
            </div>

            {/* Inspiration Prompts */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Inspiration Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ideaPrompts.map((prompt) => {
                        const Icon = prompt.icon;
                        const isSelected = selectedPrompts.includes(prompt.id);

                        return (
                            <div
                                key={prompt.id}
                                onClick={() => handlePromptToggle(prompt.id)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                                    }`}
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-medium text-gray-900">{prompt.label}</h4>
                                </div>
                                <p className="text-sm text-gray-600">{prompt.description}</p>
                            </div>
                        );
                    })}
                </div>

                {selectedPrompts.length === 0 && (
                    <p className="text-center text-gray-500 mt-6 italic">
                        Select one or more inspiration sources to generate relevant ideas
                    </p>
                )}
            </div>

            {/* Generated Ideas */}
            {generatedIdeas.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                        Generated Ideas ({generatedIdeas.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {generatedIdeas.map((idea, index) => (
                            <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed mb-3">{idea.description}</p>
                                        <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block mb-3">
                                            💡 {idea.inspiration}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {idea.category}
                                    </span>
                                    {idea.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => addIdeaToCollection(idea)}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
                                    >
                                        <span>Add to Ideas</span>
                                    </button>
                                    <div className="flex space-x-2">
                                        <button className="text-gray-400 hover:text-purple-600 transition-colors">
                                            <span className="text-lg">👍</span>
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                                            <span className="text-lg">👎</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={generateIdeas}
                            disabled={isGenerating}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-2 mx-auto"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Generate More Ideas</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Getting Started Message */}
            {generatedIdeas.length === 0 && selectedPrompts.length > 0 && (
                <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <Sparkles className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Ideas!</h3>
                    <p className="text-gray-600 mb-4">
                        You've selected {selectedPrompts.length} inspiration source{selectedPrompts.length > 1 ? 's' : ''}.
                        Click "Generate Ideas" to get started.
                    </p>
                </div>
            )}
        </div>
    );
};

export default IdeaGenerationBoard;