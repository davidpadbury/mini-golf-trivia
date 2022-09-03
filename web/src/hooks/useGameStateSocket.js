import { useState, useEffect } from 'react';


function useGameStateSocket(url) {
    const [gameState, setGameState] = useState(null)
    
    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onmessage = (msg) => {
            const newState = JSON.parse(msg.data);
            console.log(newState);
            setGameState(newState);
        };

        return () => socket.close();
    }, []);

    return gameState;
}

export default useGameStateSocket;