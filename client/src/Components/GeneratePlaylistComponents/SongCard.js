import { Component } from "react";
import "./SongCard.css"
import { FaPlay } from "react-icons/fa"
import { MdPause } from "react-icons/md"
import { Howl } from "howler"
class SongCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playing: false,
            playingSong: null // url + songObj
        }
    }

    playPause = (src) => {
        if (this.state.playing && this.state.playingSong.url === src) {
            this.state.playingSong.sound.pause()
            this.setState({ playingSong: null, playing: false })
        } else if (this.state.playing && this.state.playingSong.url != src) {
            this.state.playingSong.sound.pause()
            const sound = new Howl({
                src,
                html5: true
            })
            this.setState({ playingSong: { url: src, sound: sound }, playing: true })
            sound.play()
        } else if (!this.state.playing) {
            const sound = new Howl({
                src,
                html5: true
            })
            this.setState({ playingSong: { url: src, sound: sound }, playing: true })
            sound.play()



        }
    }


    render() {
        let name = this.props.song.name
        let imageUrl = this.props.song.album.images[1].url
        let artistName = this.props.song.artists[0].name
        let previewUrl = this.props.song.preview_url //can be null
        return (

            <div className="songCard">
                <img className="image" src={imageUrl} />
                <div className="titleAndArtist">
                    <div className="title">{name}</div>
                    <div className="artist">{artistName}</div>
                </div>
                <button className="songPreviewButton" disabled={previewUrl == null} onClick={() => this.playPause(previewUrl)}>{this.state.playing ? <MdPause /> : <FaPlay />}</button>

            </div>



        )
    }



}

export default SongCard