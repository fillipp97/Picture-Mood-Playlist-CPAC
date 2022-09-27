import { useState } from "react";
import { useEffect } from "react";



function RenderCovers(props) {
  const [covers, setCovers] = useState();

  const splitVector = (urls) => {
    const chunkSize = 20;
    const vertSize = 10;
    const Matrix = Array();

    for (let i = 0; i < vertSize * chunkSize; i += chunkSize) {
      const chunk = Array()
      for (let j = 0; j < chunkSize; j++) {
        let index = (i + j + Math.floor(Math.random() * urls.length)) % urls.length
        chunk.push(urls[index])
      }
      Matrix.push(chunk)
    }
    return Matrix
  }

  useEffect(() => {
    const songs = props.songs;
    let urls = songs.map((item) =>
      item.track.album.images[2].url
    )

    if (typeof (urls) !== 'undefined' && urls != null) {
      let vectors = splitVector(urls)
      console.log(vectors)

      let coversVar = (vectors.map((url_vector, id) => (
        <div key={id} className={"cover-container-internal" + (id % 2)}>
          {url_vector.map((url, id) => (
            <img key={id} src={url}></img>))}

        </div>
      )))
      setCovers(coversVar)
    }

  }, [props.songs])

  return covers

}

export default RenderCovers