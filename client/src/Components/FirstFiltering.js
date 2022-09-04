import React from 'react'

export default function FirstFiltering({ firstFilteringInput, callback }) {
    const mood = firstFilteringInput.mood
    const objects = firstFilteringInput.objects
    const artists = firstFilteringInput.artists
    const genres = firstFilteringInput.genres

    console.log('objects', objects)
    console.log('artists', artists)
    console.log('genres', genres)

    return (
        <>
            <div style={{background: "gray"}}>
                <p>Your mood is {mood}</p>
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
            </div>
        </>
    )
}
