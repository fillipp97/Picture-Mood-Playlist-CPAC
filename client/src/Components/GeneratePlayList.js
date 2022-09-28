import React, { useState, useEffect } from 'react';
import "./GeneratePlayList.css"
import SongCard from "../Components/GeneratePlaylistComponents/SongCard"
import FadeInLefth1 from '../Styled/FadeInLefth1.styled';
import FadeInLefth2 from '../Styled/FadeInLefth2.styled';
import { Howl } from "howler"


export default function GeneratePlayList({ generatePlayListInput, callback }) {
    const [playListName, updatePlayListName] = useState('');
    const [playing, switchPlaying] = useState(false);
    const [currentPlayingSong, modifyPlayingSong] = useState(null); // url + songObj
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
    const playPause = (src, buttonNumber) => {
        if (playing && currentPlayingSong.url === src) {
            currentPlayingSong.sound.pause()
            modifyPlayingSong(null)
            switchPlaying(false)
        } else if (playing && currentPlayingSong.url != src) {
            currentPlayingSong.sound.pause()
            const sound = new Howl({
                src,
                html5: true
            })
            modifyPlayingSong({ url: src, sound: sound })
            switchPlaying(true)
            sound.play()
        } else if (!playing) {
            const sound = new Howl({
                src,
                html5: true
            })
            modifyPlayingSong({ url: src, sound: sound })
            switchPlaying(true)
            sound.play()

        }
    }

    return (
        <>
            <div className="allSongs">
                <FadeInLefth1 text={["It's time to see the results!"]} />
                <FadeInLefth2 text={["Here's a list of songs that our AI selected for you"]} />

                {recommendations && recommendations.tracks.map((item, idx) => {
                    return <SongCard key={idx} idx={idx} song={item} playPause={playPause} playing={playing}></SongCard>
                })}

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
                <button className="Button" onClick={sendPlayList}>Save to Spotify</button>
            </div>
        </>
    )
}
