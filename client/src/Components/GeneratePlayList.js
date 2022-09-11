import React, { useState, useEffect } from 'react';

export default function GeneratePlayList({ generatePlayListInput, callback }) {
    console.warn('generatePlayListInput',generatePlayListInput)

    const lyrics = generatePlayListInput.lyrics;
    const recommendations = generatePlayListInput.recommendations.tracks;

    const sendPlayList = () => {
        callback({
        });
    };

    return (
        <>
        <p>SONG LIST</p>
        <ul>
        {recommendations.map((item) => (
            <li key={item.id}>{item.name}</li>
            ))}
        </ul>
        <p>RANDOM LYRICS</p>
        <ul>
        {lyrics.map((item) => (
            <li key={item}>{item}</li>
            ))}
        </ul>
        <p>playlist name to submit</p>
        <button className="Button" onClick={sendPlayList}>Send Song Request</button>
        </>
    )
}
