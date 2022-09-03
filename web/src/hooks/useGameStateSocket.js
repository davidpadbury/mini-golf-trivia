import { useState, useEffect } from 'react';

const WEBSOCKET_OPEN_RETRY_MS = 1000;

function kindaReliableWebSocket(url, dataCallback) {
    let socket = null;
    let closed = false;

    function open() {
        if (closed) return;

        try {
            socket = new WebSocket(url);
            
            socket.onmessage = (msg) => {
                const newState = JSON.parse(msg.data);
                dataCallback(newState);
            };

            socket.onclose = e => {
                // if we didn't mean to close the socket, attempt to reopen it
                if (!closed) {
                    setTimeout(open, WEBSOCKET_OPEN_RETRY_MS);
                }
            };
        } catch (err) {
            console.error('Failed to open websocket', err);
            setTimeout(open, WEBSOCKET_OPEN_RETRY_MS);
        }
    }

    function close() {
        closed = true;
        if (socket) socket.close();
    }

    open();

    return {
        close
    }
}


function useGameStateSocket(url) {
    const [gameState, setGameState] = useState(null)
    
    useEffect(() => {
        const socket = kindaReliableWebSocket(url, state => setGameState(state));

        return () => socket.close();
    }, []);

    return gameState;
}

export default useGameStateSocket;