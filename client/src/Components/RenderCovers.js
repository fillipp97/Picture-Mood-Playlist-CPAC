


function RenderCovers(){


    const splitVector=(urls)=>{
        const chunkSize = 20;
        const vertSize=10;
        const Matrix = Array();
        
        for(let i=0; i<vertSize*chunkSize; i+=chunkSize){
          const chunk = Array()
          for(let j=0; j<chunkSize;j++){
            let index=(i+j+Math.floor(Math.random()*urls.length)) % urls.length
            chunk.push(urls[index])
          }
          Matrix.push(chunk)
        }
        return Matrix
       }
     
    const songs=this.props.song;
    let urls = songs.map((item)=>
    item.track.album.images[1].url
    )

    if(typeof(urls) !== 'undefined' && urls != null){
    let vectors = splitVector(urls)
    console.log(vectors)

    return (vectors.map((url_vector,id)=>(
        <div className={"cover-container-internal" + (id % 2) }>        
        {url_vector.map((url)=>(
            <img src={url}></img>))}
            
        </div>
    )))
    }
       
}

export default RenderCovers