const createContext = (chatHistory, contextWindow = 5) => {
    const recentHistory = chatHistory.slice(-contextWindow);
    return recentHistory.map(item => `User: ${item.prompt}\nAssistant: ${item.response}`).join('\n');
};

module.exports = {
    createContext
};
