import React, { useState, useEffect } from 'react';
import './FirstFiltering.css';
export default function FirstFiltering({ firstFilteringInput, callback }) {
    const mood = firstFilteringInput.mood
    const moodLLF = firstFilteringInput.moodLLF
    const objects = firstFilteringInput.objects
    const artists = firstFilteringInput.artistsSeed
    const genres = firstFilteringInput.genresSeed
    const tracks = firstFilteringInput.tracksSeed

    const [selectedObjects, updateSelectedObjects] = useState([]);
    const [selectedArtists, updateSelectedArtists] = useState([]);
    const [selectedGenres, updateSelectedGenres] = useState([]);
    const [selectedTrack, updateSelectedTrack] = useState([]);

    const sendPreferences = () => {
        callback({
            mood: firstFilteringInput.mood,
            moodLLF: firstFilteringInput.moodLLF,
            objects: selectedObjects.length > 0 ? selectedObjects : objects,
            artistsSeed: selectedArtists.length > 0 ? selectedArtists : artists,
            genresSeed: selectedGenres.length > 0 ? selectedGenres : genres,
            tracksSeed: selectedTrack.length > 0 ? selectedTrack : tracks
        });

    };

    const checkObject = (item, checked) => {
        const index = selectedObjects.indexOf(item);
        if (checked && index < 0) {
            updateSelectedObjects([...selectedObjects, item]);
        } else {
            selectedObjects.splice(index, 1)
            updateSelectedObjects([...selectedObjects]);
        }
    }

    const checkArtist = (item, checked) => {
        const index = selectedArtists.indexOf(item);
        if (checked && index < 0) {
            updateSelectedArtists([...selectedArtists, item]);
        } else {
            selectedArtists.splice(index, 1)
            updateSelectedArtists([...selectedArtists]);
        }
    }

    const checkGenre = (item, checked) => {
        const index = selectedGenres.indexOf(item);
        if (checked && index < 0) {
            updateSelectedGenres([...selectedGenres, item]);
        } else {
            selectedGenres.splice(index, 1)
            updateSelectedGenres([...selectedGenres]);
        }
    }

    const checkTrack = (item, checked) => {
        const index = selectedTrack.indexOf(item);
        if (checked && index < 0) {
            updateSelectedTrack([...selectedTrack, item]);
        } else {
            selectedTrack.splice(index, 1)
            updateSelectedTrack([...selectedTrack]);
        }
    }

    return (
        <>
            <div className="Informations">
                <p>Your mood is {mood} or {moodLLF}</p>
                <p>Objects we found in your picture:</p>
				<div className="Information">
                {objects.map((item) => (
                    <label key={item}>
                        <input type="checkbox" key={item} value={item} onChange={(e) => checkObject(item, e.target.checked)} />
                        {item}
                    </label>
                ))}
				</div>
                <p>Some artists you might like:</p>
				<div className="Information">
                {artists.map((item) => (
                    <label key={item.id}>
                        <input type="checkbox" key={item.id} value={item} onChange={(e) => checkArtist(item, e.target.checked)} />
                        {item.name}
                    </label>
                ))}
				</div>
                <p>Some genres you might like:</p>
				<div className="Information">
                {genres.map((item) => (
                    <label key={item}>
                        <input type="checkbox" key={item} value={item} onChange={(e) => checkGenre(item, e.target.checked)} />
                        {item}
                    </label>
                ))}
				</div>
                <p>Some tracks you might like:</p>
				<div className="Information">
                {tracks.map((item) => (
                    <label key={item.id}>
                        <input type="checkbox" key={item.id} value={item.id} onChange={(e) => checkTrack(item, e.target.checked)} />
                        {item.name}
                    </label>
                ))}
				</div>
            </div>
            <button className="Button" onClick={sendPreferences}>Send Request</button>
        </>
    )
}
