import axios from "axios"

export async function isLoggedIn() {
    const response = await axios({
        method: 'GET',
        url: '/checkLogState'
    })
    return response.data.result === 'bad' ? false : true;
}

export async function logIn() {
    const response = await axios({
        method: "GET",
        url: "/login"
    })
    return response.data;
}

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append(
        "Image",
        file,
        'Image.jpg'
    );
    const response = await axios.post("/uploadFile", formData)
    return response.data
}

export async function getTracks() {
    const response = await axios({
        method: "GET",
        url: "/getTracks"
    })
    return response.data;
}

export async function getRecommendedSongs(imageStepResults) {

    let data = {

        'mood': imageStepResults.mood,
        'moodLLF': imageStepResults.moodLLF,
        'objects': imageStepResults.objects,
        'genresSeed': imageStepResults.genresSeed,
        'artistsSeed': imageStepResults.artistsSeed,
        'tracksSeed': imageStepResults.tracksSeed,


    }
    console.log(data)
    const response = await axios.post("/getSongs", JSON.stringify(data), {
        'headers': { 'Content-Type': "application/json" }
    })
    return response.data
}

export async function savePlaylist(data) {
    const response = await axios.post("/savePlaylist", JSON.stringify(data), {
        'headers': { 'Content-Type': "application/json" }
    })
    return response.data
}