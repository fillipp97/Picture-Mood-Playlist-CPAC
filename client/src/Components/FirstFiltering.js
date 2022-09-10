import React from 'react'

export default function FirstFiltering({ firstFilteringInput, callback }) {
    const mood = firstFilteringInput.mood
    const moodLLF = firstFilteringInput.moodLLF
    const objects = firstFilteringInput.objects
    const artists = firstFilteringInput.artistsSeed
    const genres = firstFilteringInput.genresSeed
    const tracks = firstFilteringInput.tracksSeed

    console.log('objects', objects)
    console.log('artists', artists)
    console.log('genres', genres)
    console.log('tracks', tracks)

    return (
        <>
            <div style={{ background: "gray" }}>
                <p>Your mood is {mood} or {moodLLF}</p>
                <p>Objects we found in your picture:</p>
                <ul>
                    {objects.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <p>Some artists you might like:</p>
                <ul>
                    {artists.map((item) => (
                        <li key={item}>{item.name}</li>
                    ))}
                </ul>
                <p>Some genres you might like:</p>
                <ul>
                    {genres.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <p>Some tracks you might like:</p>
                <ul>
                    {tracks.map((item) => (
                        <li key={item}>{item.name}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}
