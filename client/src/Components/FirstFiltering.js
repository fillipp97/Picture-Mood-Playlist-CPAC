import React, { useState, useEffect } from 'react';
import FadeInLefth1 from '../Styled/FadeInLefth1.styled';
import Entertainment from './Entertainment';
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
    const [step, incrementStep] = useState(0);
    const sendPreferences = () => {
        console.log("ARTISTS EXITING FROM FF", selectedArtists)
        callback({
            mood: firstFilteringInput.mood,
            moodLLF: firstFilteringInput.moodLLF,
            objects: selectedObjects.length > 0 ? selectedObjects : [],//objects,
            artistsSeed: selectedArtists.length > 0 ? selectedArtists : [], //artists,
            genresSeed: selectedGenres.length > 0 ? selectedGenres : genres,
            tracksSeed: selectedTrack.length > 0 ? selectedTrack : [],//tracks
        });

    };

    const incrementFFStep = () => {
        incrementStep(step + 1)
    }


    return (
        <>
            <div className="Informations">
                {console.log("FF STATE", selectedArtists, selectedObjects, selectedTrack)}
                {step === 0 && <Entertainment mood={mood} moodLLF={moodLLF} objects={objects} artists={artists} tracks={tracks} incrementFirstFilterStep={incrementFFStep} updateSelectedArtists={updateSelectedArtists} updateSelectedObjects={updateSelectedObjects} updateSelectedTrack={updateSelectedTrack}></Entertainment>}
                {step >= 1 && <FadeInLefth1 text="Now it's time to submit your choices and trust the AI" callbacks={[() => { setTimeout(() => { incrementFFStep() }, 2000) }]} />}
                {step >= 2 && <button className="Button" onClick={sendPreferences}>Send Song Request</button>}
            </div>

        </>
    )
}







// const checkObject = (item, checked) => {
//     const index = selectedObjects.indexOf(item);
//     if (checked && index < 0) {
//         updateSelectedObjects([...selectedObjects, item]);
//     } else {
//         selectedObjects.splice(index, 1)
//         updateSelectedObjects([...selectedObjects]);
//     }
// }

// const checkArtist = (item, checked) => {
//     const index = selectedArtists.indexOf(item);
//     if (checked && index < 0) {
//         updateSelectedArtists([...selectedArtists, item]);
//     } else {
//         selectedArtists.splice(index, 1)
//         updateSelectedArtists([...selectedArtists]);
//     }
// }

// const checkGenre = (item, checked) => {
//     const index = selectedGenres.indexOf(item);
//     if (checked && index < 0) {
//         updateSelectedGenres([...selectedGenres, item]);
//     } else {
//         selectedGenres.splice(index, 1)
//         updateSelectedGenres([...selectedGenres]);
//     }
// }

// const checkTrack = (item, checked) => {
//     const index = selectedTrack.indexOf(item);
//     if (checked && index < 0) {
//         updateSelectedTrack([...selectedTrack, item]);
//     } else {
//         selectedTrack.splice(index, 1)
//         updateSelectedTrack([...selectedTrack]);
//     }
// }
{/* <p>Your mood is {mood ? mood : moodLLF}</p>
                <p>Objects we found in your picture:</p>
				<div className="Information">
                {objects.map((item) => (
                    <label key={item}>
                        <input type="checkbox" key={item} value={item} onChange={(e) => checkObject(item, e.target.checked)} />
                        {item}
                    </label>
                ))}
				</div>
				<div className="Information">
                <p>Some artists you might like:</p>
                {artists.map((item) => (
                    <label key={item.id}>
                        <input type="checkbox" key={item.id} value={item} onChange={(e) => checkArtist(item, e.target.checked)} />
                        {item.name}
                    </label>
                ))}
				</div>
				<div className="Information">
                <p>Some genres you might like:</p>
                {genres.map((item) => (
                    <label key={item}>
                        <input type="checkbox" key={item} value={item} onChange={(e) => checkGenre(item, e.target.checked)} />
                        {item}
                    </label>
                ))}
				</div>
				<div className="Information">
                <p>Some tracks you might like:</p>
                {tracks.map((item) => (
                    <label key={item.id}>
                        <input type="checkbox" key={item.id} value={item.id} onChange={(e) => checkTrack(item, e.target.checked)} />
                        {item.name}
                    </label>
                ))} */}