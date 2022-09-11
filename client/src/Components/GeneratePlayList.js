import React, { useState, useEffect } from 'react';

export default function GeneratePlayList({ generatePlayListInput, callback }) {
    const [playListName, updatePlayListName] = useState('');

    const lyrics = generatePlayListInput.lyrics;
    const recommendations = generatePlayListInput.recommendations;

    const sortRecommendations = () => {
        (recommendations && recommendations[0] && recommendations[0].score != null) && recommendations.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
    };

    const handlePlayListNameChange = (event) => {
        updatePlayListName(event.target.value)
    }

    const sendPlayList = () => {
        callback({
            playlist_title: playListName,
            songs: generatePlayListInput.recommendations
        });
    };

    sortRecommendations()

    return (
        <>
            <div style={{ background: "gray" }}>
                <h1>Generate Playlist</h1>
                <p>SONG LIST</p>
                <ul>
                    {recommendations && recommendations.tracks.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
                <p>RANDOM LYRICS</p>
                <ul>
                    {lyrics && lyrics.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <input type="text" value={playListName} onChange={handlePlayListNameChange} />
                <p>playlist name to submit</p>
                <button className="Button" onClick={sendPlayList}>Send Song Request</button>
            </div>
        </>
    )
}
