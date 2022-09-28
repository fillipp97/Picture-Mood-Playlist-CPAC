import { Component } from "react";
import "./SongCard.css"
import { FaPlay } from "react-icons/fa"
import { MdPause } from "react-icons/md"

class SongCard extends Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     playing: false,
        //     playingSong: null // url + songObj
        // }
    }




    render() {
        let name = this.props.song.name
        let imageUrl = this.props.song.album.images[1].url
        let artistName = this.props.song.artists[0].name
        let previewUrl = this.props.song.preview_url //can be null
        return (

            <li className="songCard">
                <img className="image" src={imageUrl} />
                <div className="titleAndArtist">
                    <div className="title">{name}</div>
                    <div className="artist">{artistName}</div>
                </div>
                <button className="songPreviewButton" disabled={previewUrl == null} onClick={() => this.props.playPause(previewUrl, this.props.idx)}>{this.props.playingId == this.props.idx ? <MdPause /> : <FaPlay />}</button>

            </li>



        )
    }



}

export default SongCard