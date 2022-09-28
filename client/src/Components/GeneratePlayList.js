import React, { useState, useEffect } from 'react';
import "./GeneratePlayList.css"
import SongCard from "../Components/GeneratePlaylistComponents/SongCard"
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

    // sortRecommendations()

    return (
        <>
            <div className="allSongs">
                <h1>Generate Playlist</h1>
                <p>SONG LIST</p>
                <ul>
                    {recommendations && recommendations.tracks.map((item) => {
                        return <SongCard song={item}  ></SongCard>
                    })}
                </ul>
                <p>RANDOM LYRICS</p>
                <ul>
                    {lyrics && lyrics.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <label class="input">
                    <input class="input__field" type="text" value={playListName} onChange={handlePlayListNameChange} />
                </label>
                <p>playlist name to submit</p>
                <button className="Button" onClick={sendPlayList}>Generate Playlist</button>
            </div>
        </>
    )
}
